import cds from "@sap/cds";

export class RiskService extends cds.ApplicationService {
    async init() {
        const BPService = await cds.connect.to("API_BUSINESS_PARTNER");

        this.on("READ", "BusinessPartners", (req, next) => {
            return this._readBusinessPartners(req, next, BPService);
        });

        this.on("READ", "Risks", async (req, next) => {
            return this._handleRisksRead(req, next, BPService);
        });
        
        this.after("READ", "Risks", (res, req) => {
            return this._calculateRisksCriticality(res, req);
        });

        this.on("error", (err, req) => {
            return this._handleError(err, req);
        });

        return super.init();
    }

    async _readBusinessPartners(req, next, service) {
        req.query.where("LastName <> '' and FirstName <> ''");

        return await service.transaction(req).send({
            query: req.query
        });
    }

    async _handleRisksRead(req, next, service) {
        if (!this._columns(req)) {
            return next();
        }

        const expandIndex = this._isPartnersToExpand(req);

        if (expandIndex < 0) {
            return next();
        }

        this._columns(req).splice(expandIndex, 1);

        if (!this._isReferenceToBP(req)) {
            this._addReferenceToBP(req);
        }

        await this._tryToExpandBP(req, next, service);
    }

    _isPartnersToExpand(req) {
        return this._columns(req).findIndex(({expand, ref}) => expand && ref[0] === "bp");
    }

    _isReferenceToBP(req) {
        return this._columns(req).find(column => {
            return column.ref.find(ref => ref == "bp_BusinessPartner")
        });
    }

    _addReferenceToBP(req) {
        this._columns(req).push({ ref: ["bp_BusinessPartner"]});
    }

    async _tryToExpandBP(req, next, service) {
        try {
            const risks = this._castToArray(await next());

            return await Promise.all(risks.map(async risk => {
                risk.bp = await this._loadBusinessPartnerByRisk(req, service, risk);
                return risk;
            }));
        } catch (err) {
            console.log(err);
        }
    }

    _loadBusinessPartnerByRisk(req, service, risk) {
        return service.transaction(req).send({
            query: SELECT.one(this.entities.BusinessPartners)
                .where({BusinessPartner: risk.bp_BusinessPartner })
                .columns(["BusinessPartner", "LastName", "FirstName"])
        });
    }

    _columns(req) {
        return req.query.SELECT.columns; 
    }

    _castToArray(value) {
        return Array.isArray(value) ? value : [value];
    }

    _calculateRisksCriticality(res, req) {
        const arr = this._castToArray(res);
        arr.forEach(risk => risk.criticality = (risk.impact > 10000 ? 1 : 2));
    }

    _handleError(err, req) {
        if (err.code == "404") {
            err.message = `[${req.method}]: Can't find ${req.target.name} with specified id: ${req.data.ID}`;
        }
    }
}
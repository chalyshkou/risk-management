import cds from "@sap/cds";

export class RiskService extends cds.ApplicationService {
    async init() {
        const BPService = await cds.connect.to("API_BUSINESS_PARTNER");

        this.on("READ", "BusinessPartners", (req, next) => {
            return this._readBusinessPartners(req, next, BPService);
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
            query: req.query,
            headers: {
                APIKey: process.env.apikey
            }
        });
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
import cds from "@sap/cds";

function _logReqInfo(req, when) {
    console.log("==================================");
    console.log(`When   : ${when}`);
    console.log(`Method : ${req.method}`);
    console.log(`Target : ${req.target.name}`);
    console.log("==================================");
}

export class RiskService extends cds.ApplicationService {
    init() {
        const { Risks, Mitigations } = this.entities;

        this.before("*", (req) => {
            _logReqInfo(req, "before");
        });
        
        this.on("*", async (req, next) => {
            _logReqInfo(req, "on");
            
            let result = await next();
            return result;
        });
        
        this.after("*", (res, req) => {
            _logReqInfo(req, "after");
        });

        this.on("error", (err, req) => {
            if (err.code == "404") {
                err.message = `[${req.method}]: Can't find ${req.target.name} with specified id: ${req.data.ID}`;
            }
        });

        return super.init();
    }
}
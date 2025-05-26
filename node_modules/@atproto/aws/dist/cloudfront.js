"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudfrontInvalidator = void 0;
const aws = __importStar(require("@aws-sdk/client-cloudfront"));
class CloudfrontInvalidator {
    constructor(cfg) {
        Object.defineProperty(this, "distributionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pathPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { distributionId, pathPrefix, ...rest } = cfg;
        this.distributionId = distributionId;
        this.pathPrefix = pathPrefix ?? '';
        this.client = new aws.CloudFront({
            ...rest,
            apiVersion: '2020-05-31',
        });
    }
    async invalidate(subject, paths) {
        await this.client.createInvalidation({
            DistributionId: this.distributionId,
            InvalidationBatch: {
                CallerReference: `cf-invalidator-${subject}-${Date.now()}`,
                Paths: {
                    Quantity: paths.length,
                    Items: paths.map((path) => this.pathPrefix + path),
                },
            },
        });
    }
}
exports.CloudfrontInvalidator = CloudfrontInvalidator;
exports.default = CloudfrontInvalidator;
//# sourceMappingURL=cloudfront.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamProfileSynchronizer = void 0;
const common_1 = require("@atproto/common");
const background_1 = require("../background");
class TeamProfileSynchronizer extends background_1.PeriodicBackgroundTask {
    constructor(backgroundQueue, teamService, interval = 24 * common_1.HOUR) {
        super(backgroundQueue, interval, async () => {
            await teamService.syncMemberProfiles();
        });
    }
}
exports.TeamProfileSynchronizer = TeamProfileSynchronizer;
//# sourceMappingURL=team-profile-synchronizer.js.map
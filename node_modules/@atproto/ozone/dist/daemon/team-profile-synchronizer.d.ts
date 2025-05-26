import { BackgroundQueue, PeriodicBackgroundTask } from '../background';
import { TeamService } from '../team';
export declare class TeamProfileSynchronizer extends PeriodicBackgroundTask {
    constructor(backgroundQueue: BackgroundQueue, teamService: TeamService, interval?: number);
}
//# sourceMappingURL=team-profile-synchronizer.d.ts.map
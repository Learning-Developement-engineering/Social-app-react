import { $Typed, ToolsOzoneModerationDefs } from '@atproto/api';
import { AppContext } from '../context';
import { ModerationService } from '../mod-service';
import { ParsedLabelers } from '../util';
export declare const getReposForVerifications: (ctx: AppContext, labelers: ParsedLabelers, modService: ModerationService, dids: string[], isModerator: boolean) => Promise<Map<string, $Typed<ToolsOzoneModerationDefs.RepoViewDetail> | $Typed<ToolsOzoneModerationDefs.RepoViewNotFound>>>;
//# sourceMappingURL=util.d.ts.map
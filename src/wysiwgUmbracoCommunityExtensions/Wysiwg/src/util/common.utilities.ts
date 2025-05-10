import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { GetServerInformationResponse, ServerService } from "../management-api";
import { SemVersion } from "./types";
import { UmbNotificationContext } from "@umbraco-cms/backoffice/notification";

export class CommonUtilities {
  private _localize: UmbLocalizationController;
  private _notificationContext: UmbNotificationContext;

  constructor(localize: UmbLocalizationController, notificationContext: UmbNotificationContext) {
    this._localize = localize;
    this._notificationContext = notificationContext;
  }

  public async getUmbracoVersion(notificationContext?: UmbNotificationContext): Promise<SemVersion | undefined> {
    if (!notificationContext) { return; }

    const { data, error } = await ServerService.getServerInformation();

    if (error) {
      console.error(error);
      if (this._notificationContext) {
          this._notificationContext.stay("danger", {
            data: {
              headline: this._localize.term("wysiwg_serverInfoError"),
              message: `${this._localize.term("wysiwg_serverInfoErrorDescription")}`,
            },
          });
        }
      return;
    }

    if (data !== undefined) {
      const serverInfo = data as GetServerInformationResponse;
      const assemblyVersion = serverInfo?.assemblyVersion.split(".");
      const version = {
        major: assemblyVersion.length > 0 ? parseInt(assemblyVersion[0]) : 1,
        minor: assemblyVersion.length > 1 ? parseInt(assemblyVersion[1]) : 0,
        patch: assemblyVersion.length > 2 ? parseInt(assemblyVersion[2]) : 0
      } as SemVersion;

      return version;
    }
  }
}

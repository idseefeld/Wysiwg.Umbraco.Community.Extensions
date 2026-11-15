import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { getServerInformation, GetServerInformationResponse } from "../management-api";
import { SemVersion } from "../types";
import { UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { UpdateStatus } from "../types";
import { getUpdateStatusCode } from "../api";

export class CommonUtilities {
  private _localize: UmbLocalizationController;
  private _notificationContext?: UmbNotificationContext;

  constructor(localize: UmbLocalizationController, notificationContext?: UmbNotificationContext) {
    this._localize = localize;
    this._notificationContext = notificationContext;
  }

  public destroy(){}

  public async getUmbracoVersion(): Promise<SemVersion | undefined> {
    if (!this._notificationContext) { return; }

    const { data, error } = await getServerInformation();

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

  public async getUpdateStatus(): Promise<UpdateStatus | undefined> {
    const { data, error } =
      await getUpdateStatusCode();

    if (error) {
      console.error(error);
      if (this._notificationContext) {
        this._notificationContext.stay("danger", {
          data: {
            headline: this._localize.term("wysiwg_versionError"),
            message: `${this._localize.term("wysiwg_versionErrorDescription")} ${error}`,
          },
        });
      }
    }

    if (data !== undefined) {
      return data as UpdateStatus;
    }
  }
}

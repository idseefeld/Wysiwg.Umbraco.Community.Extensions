import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbApi } from '@umbraco-cms/backoffice/extension-api';
import { WysiwgUmbracoCommunityExtensionsService } from '../api';
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
// import { UpdateStatus } from '../util/updateStatusEnum';
// import { UmbLocalizationController } from '@umbraco-cms/backoffice/localization-api';
import { UmbNumberState } from '@umbraco-cms/backoffice/observable-api';

export class WysiwgBlockGridContextApi extends UmbContextBase implements UmbApi {
  #updateStatusCode = new UmbNumberState(0);;
  readonly updateStatusCode = this.#updateStatusCode.asObservable();

  #notificationContext: UmbNotificationContext | undefined = undefined;
  // #localize: UmbLocalizationController;

  constructor(host: UmbControllerHost) {
    super(host, WYSIWG_BLOCKGRID_CONTEXT);

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    this.setUpdateStatus();
  }

  // Define your context methods here
  getContextData() {
    return 'Hello from Wysiwg Context!';
  }

  public async setUpdateStatus() {
    // if (this.#updateStatusCode) return;

    await this.getUpdateStatus(this.#notificationContext)
      .then((status) => {
        if (status) {
          this.#updateStatusCode.setValue(status);
          // this.#updateStatusCode = status;
        }
      });
  }

  private async getUpdateStatus(notificationContext?: UmbNotificationContext): Promise<number | undefined> {
    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.getUpdateStatusCode();

    if (error) {
      console.error(error);
      if (notificationContext) {
        notificationContext.stay("danger", {
          data: {
            headline: "Error getting status",// this._localize.term("wysiwg_versionError"),
            message: "Could not get the current wysiwyg status.",//`${this._localize.term("wysiwg_versionErrorDescription")} ${error}`,
          },
        });
      }
    }

    if (data !== undefined) {
      return data;
    }
  }
}

// Important to export as api for the Extension Registry to pick up the class:
export const api = WysiwgBlockGridContextApi;

export const WYSIWG_BLOCKGRID_CONTEXT = new UmbContextToken<WysiwgBlockGridContextApi>(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);


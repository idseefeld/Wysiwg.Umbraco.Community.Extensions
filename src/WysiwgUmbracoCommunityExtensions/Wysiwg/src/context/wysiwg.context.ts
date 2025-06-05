import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbApi } from '@umbraco-cms/backoffice/extension-api';
import { WysiwgUmbracoCommunityExtensionsService } from '../api';
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
// import { UpdateStatus } from '../util/updateStatusEnum';
// import { UmbLocalizationController } from '@umbraco-cms/backoffice/localization-api';
import { UmbNumberState } from '@umbraco-cms/backoffice/observable-api';
import { UmbLocalizationController } from '@umbraco-cms/backoffice/localization-api';

export class WysiwgBlockGridContextApi extends UmbContextBase implements UmbApi {
  #localize = new UmbLocalizationController(this);
  #updateStatusCode = new UmbNumberState(0);;
  readonly updateStatusCode = this.#updateStatusCode.asObservable();

  #notificationContext: UmbNotificationContext | undefined = undefined;

  constructor(host: UmbControllerHost) {
    super(host, WYSIWG_BLOCKGRID_CONTEXT);

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    this.setUpdateStatus();
  }

  /**
   * Sets the update status code for the WYSIWYG block grid.
   * This method retrieves the current update status from the service and updates the observable.
   * If an error occurs during retrieval, it will notify the user through the notification context.
   */
  public async setUpdateStatus() {
    // if (this.#updateStatusCode) return;

    await this.getUpdateStatus()
      .then((status) => {
        if (status) {
          this.#updateStatusCode.setValue(status);
        }
      });
  }

  /**
   * Retrieves the current update status code from the WYSIWYG service.
   * If an error occurs, it logs the error and notifies the user through the notification context.
   * @returns {Promise<number | undefined>} The update status code or undefined if an error occurs.
   */
  private async getUpdateStatus(): Promise<number | undefined> {
    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.getUpdateStatusCode();

    if (error) {
      console.error(error);
      if (this.#notificationContext) {
        this.#notificationContext.stay("danger", {
          data: {
            headline: this.#localize.term("wysiwg_versionError"),
            message: `${this.#localize.term("wysiwg_versionErrorDescription")} ${error}`,
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


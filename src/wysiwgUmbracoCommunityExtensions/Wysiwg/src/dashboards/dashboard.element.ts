import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UUIButtonElement } from "@umbraco-cms/backoffice/external/uui";
import {
  UMB_NOTIFICATION_CONTEXT,
  UmbNotificationContext,
} from "@umbraco-cms/backoffice/notification";
import {
  UMB_CURRENT_USER_CONTEXT,
  UmbCurrentUserModel,
} from "@umbraco-cms/backoffice/current-user";
import { WysiwgUmbracoCommunityExtensionsService } from "../api";

@customElement("wysiwg-dashboard")
export class WysiwgDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _contextCurrentUser: UmbCurrentUserModel | undefined = undefined;
  private _debug: boolean = true;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (currentUserContext) => {
      // When we have the current user context
      // We can observe properties from it, such as the current user or perhaps just individual properties
      // When the currentUser object changes we will get notified and can reset the @state properrty
      this.observe(currentUserContext.currentUser, (currentUser) => {
        this._contextCurrentUser = currentUser;
      });
    });
  }

  #notificationContext: UmbNotificationContext | undefined = undefined;

  #onClickInstall = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    buttonElement.state = "waiting";
    // buttonElement.state = "success";
    // buttonElement.state = "failed";

    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.install();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${error}`,
          },
        });
      }
      buttonElement.state = "failed";
      console.error(error);
      return "error";
    }

    if (data !== undefined) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("positive", {
          data: {
            headline: this.localize.term("wysiwg_installSuccess"),
            message: this.localize.term("wysiwg_installSuccessDescription"),
          },
        });
      }
      buttonElement.state = "success";
      return data;
    }
  };

  #onClickUninstall = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    buttonElement.state = "waiting";

    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.unInstall();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${error}`,
          },
        });
      }
      buttonElement.state = "failed";
      console.error(error);
      return "error";
    }

    if (data !== undefined) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("positive", {
          data: {
            headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
            message: this.localize.term("wysiwg_uninstallSuccessDescription")
          },
        });
      }
      buttonElement.state = "success";
      return data;
    }
  };

  render() {
    if (!this._contextCurrentUser?.isAdmin) {
      return html`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
    }

    return html`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
              debug: this._debug,
            })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${this.#onClickInstall}"
        >
        <umb-localize key="wysiwg_setupButtonLabel" .debug=${this._debug}>
          Setup document and data types
        </umb-localize>
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_setupButtonDescription" .debug=${this._debug}>
          <p>
            This will create the document and data types needed for WYSIWG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
      <uui-box headline=${this.localize.term("wysiwg_uninstallTitle", {
              debug: this._debug,
            })}>
        <uui-button
          color="danger"
          look="primary"
          @click="${this.#onClickUninstall}"
        >
        <umb-localize key="wysiwg_uninstallButtonLabel" .debug=${this._debug}>
          Remove document and data types
        </umb-localize>
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_uninstallButtonDescription" .debug=${this._debug}>
          <p>
            This will remove the document and data types needed for WYSIWG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
    `;
  }

  static styles = [
    css`
      :host {
        display: grid;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
        grid-template-columns: 1fr 1fr 1fr;
      }

      uui-box {
        margin-bottom: var(--uui-size-layout-1);
      }

      h2 {
        margin-top: 0;
      }

      .wide {
        grid-column: span 3;
      }
    `,
  ];
}

export default WysiwgDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "wysiwg-dashboard": WysiwgDashboardElement;
  }
}

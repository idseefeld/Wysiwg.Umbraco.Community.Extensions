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

@customElement("example-dashboard")
export class ExampleDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _contextCurrentUser: UmbCurrentUserModel | undefined = undefined;

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
            headline: `Installation failed`,
            message: `${error}`,
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
            headline: `Installation successful`,
            message: `WYSIWYG document and data types created`,
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
            headline: `Uninstall failed`,
            message: `${error}`,
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
            headline: `Uninstall successful`,
            message: `WYSIWYG document and data types removed`,
          },
        });
      }
      buttonElement.state = "success";
      return data;
    }
  };

  /*
  renderBoxes() {
    return html`

      <uui-box headline="Who am I?">
        <div slot="header">[Server]</div>
        <h2>
          <uui-icon name="icon-user"></uui-icon>${this._serverUserData?.email
            ? this._serverUserData.email
            : "Press the button!"}
        </h2>
        <ul>
          ${this._serverUserData?.groups.map(
            (group) => html`<li>${group.name}</li>`
          )}
        </ul>
        <uui-button
          color="default"
          look="primary"
          @click="${this.#onClickWhoAmI}"
        >
          Who am I?
        </uui-button>
        <p>
          This endpoint gets your current user from the server and displays your
          email and list of user groups. It also displays a Notification with
          your details.
        </p>
      </uui-box>

      <uui-box headline="What's my Name?">
        <div slot="header">[Server]</div>
        <h2><uui-icon name="icon-user"></uui-icon> ${this._yourName}</h2>
        <uui-button
          color="default"
          look="primary"
          @click="${this.#onClickWhatsMyName}"
        >
          Whats my name?
        </uui-button>
        <p>
          This endpoint has a forced delay to show the button 'waiting' state
          for a few seconds before completing the request.
        </p>
      </uui-box>

      <uui-box headline="What's the Time?">
        <div slot="header">[Server]</div>
        <h2>
          <uui-icon name="icon-alarm-clock"></uui-icon> ${this._timeFromMrWolf
            ? this._timeFromMrWolf.toLocaleString()
            : "Press the button!"}
        </h2>
        <uui-button
          color="default"
          look="primary"
          @click="${this.#onClickWhatsTheTimeMrWolf}"
        >
          Whats the time Mr Wolf?
        </uui-button>
        <p>This endpoint gets the current date and time from the server.</p>
      </uui-box>
    `;
  }

    */

  render() {
    if (!this._contextCurrentUser?.isAdmin) {
      return html`<p>Only admins can see this dashboard</p>`;
    }

    return html`
      <uui-box headline="Setup WYSIWG">
        <uui-button
          color="positive"
          look="primary"
          @click="${this.#onClickInstall}"
        >
          Setup document and data types
        </uui-button>
        <div slot="header"></div>
        <p>
          This will create the document and data types needed for WYSIWG block
          editor views.
        </p>
      </uui-box>
      <uui-box headline="Remove WYSIWG">
        <uui-button
          color="danger"
          look="primary"
          @click="${this.#onClickUninstall}"
        >
          Remove document and data types
        </uui-button>
        <div slot="header"></div>
        <p>
          This will remove the document and data types needed for WYSIWG block
          editor views.
        </p>
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

export default ExampleDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "example-dashboard": ExampleDashboardElement;
  }
}

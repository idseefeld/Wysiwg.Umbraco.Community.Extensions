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
import { FixUpgradeData, GetVariationsResponse, WysiwgUmbracoCommunityExtensionsService } from "../api";
import { UpdateStatus } from "../util/updateStatusEnum";
import { umbConfirmModal, UmbConfirmModalData } from "@umbraco-cms/backoffice/modal";
import { CommonUtilities } from "../util/common.utilities";
import { SemVersion } from "../util/types";
import { Debugging } from "../constants";

@customElement("wysiwg-dashboard")
export class WysiwgDashboardElement extends UmbElementMixin(LitElement) {

  @state()
  private _contextCurrentUser: UmbCurrentUserModel | undefined = undefined;

  @state()
  private _updateStatus: UpdateStatus | undefined = undefined;

  @state()
  private _variations: GetVariationsResponse | undefined = undefined;

  @state()
  private _uninstalling: boolean = false;

  private _varyByCulture: boolean = false;
  private _varyBySegment: boolean = false;

  private _version: SemVersion = { major: 1, minor: 0, patch: 0 };

  private _debug = Debugging;

  private _commonUtilities: CommonUtilities | undefined = undefined;

  #notificationContext: UmbNotificationContext | undefined = undefined;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
      this._commonUtilities = new CommonUtilities(this.localize, notificationContext);
    });

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (currentUserContext) => {
      if (!currentUserContext) {
        this._contextCurrentUser = undefined;
        return;
      }
      // When we have the current user context
      // We can observe properties from it, such as the current user or perhaps just individual properties
      // When the currentUser object changes we will get notified and can reset the @state properrty
      this.observe(currentUserContext.currentUser, (currentUser) => {
        this._contextCurrentUser = currentUser;
      });
    });

  }

  #onChangeCulture = (ev: Event) => {
    const checkboxElement = ev.target as HTMLInputElement;
    this._varyByCulture = checkboxElement.checked;
  }
  #onChangeSegment = (ev: Event) => {
    const checkboxElement = ev.target as HTMLInputElement;
    this._varyBySegment = checkboxElement.checked;
  }

  #onClickUpdateSettings = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    if (!buttonElement || buttonElement.state === "waiting") return;
    buttonElement.state = "waiting";

    if (this._version.major > 15 || (this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0)) {
      this._varyBySegment = false;
    }
    const options: FixUpgradeData = {
      query: {
        culture: this._varyByCulture,
        segment: this._varyBySegment,
      }
    };
    const { data, error } = await WysiwgUmbracoCommunityExtensionsService.fixUpgrade(options);

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${error}`,
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
            headline: this.localize.term("wysiwg_updateSettingsSuccess"),
            message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`,
          },
        });
      }
      this.setVariations(data);
      buttonElement.state = "success";
    }
  }

  #onClickInstall = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    if (!buttonElement || buttonElement.state === "waiting") return;
    buttonElement.state = "waiting";

    const { data, error } = await WysiwgUmbracoCommunityExtensionsService.install();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.stay("danger", {
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
      if (data === "Installed") {
        if (this.#notificationContext) {
          this.#notificationContext.peek("positive", {
            data: {
              headline: this.localize.term("wysiwg_installSuccess"),
              message: this.localize.term("wysiwg_installSuccessDescription"),
            },
          });
        }
        this._updateStatus = UpdateStatus.UpToDate;
        buttonElement.state = "success";
      } else {
        buttonElement.state = "failed";
      }
    }
  };

  #onClickUninstall = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    if (!buttonElement || buttonElement.state === "waiting") return;

    const modalData: UmbConfirmModalData = {
      color: 'danger',
      headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug, }),
      content: html`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug, })}`,
      confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug, }),
      cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug, }),
    };
    await umbConfirmModal(this, modalData);
    console.log("confirmed uninstall");

    buttonElement.state = "waiting";
    this._uninstalling = true;

    const { data, error } = await WysiwgUmbracoCommunityExtensionsService.unInstall();

    this._uninstalling = false;

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${error}`,
          },
        });
        buttonElement.state = "failed";
      }
      console.error(error);
      return "error";
    }

    if (data !== undefined) {
      if (data === "Uninstalled") {
        if (this.#notificationContext) {
          this.#notificationContext.peek("positive", {
            data: {
              headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
              message: this.localize.term("wysiwg_uninstallSuccessDescription")
            },
          });
        }
        buttonElement.state = "success";
      } else {
        buttonElement.state = "failed";
      }
      this._updateStatus = undefined;
    }
  };

  private async getVariations() {
    const { data, error } = await WysiwgUmbracoCommunityExtensionsService.getVariations();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_variationsError"),
            message: `${this.localize.term("wysiwg_variationsErrorDescription")} ${error}`,
          },
        });
      }
      return "error";
    }

    if (data !== undefined) {
      this.setVariations(data);
    }
  }

  private setVariations(data: GetVariationsResponse) {
    this._variations = data;
    this._varyByCulture = this._variations.indexOf("culture") !== -1;
    this._varyBySegment = this._variations.indexOf("segment") !== -1;
  }

  render() {
    if (!this._contextCurrentUser?.isAdmin) {
      return html`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
    }

    this.setUpdateStatus();

    this.setSemVersion();

    this.getVariations()

    return html`${this.renderSetupBox()} ${this.renderUpdateBox()}`;
  }

  private async setUpdateStatus() {
    if (this._updateStatus) return;

    await this._commonUtilities?.getUpdateStatus(this.#notificationContext).then((status) => {
      if (status) {
        this._updateStatus = status;
      }
    });
  }

  private async setSemVersion() {
    await this._commonUtilities?.getUmbracoVersion(this.#notificationContext).then((version) => {
      if (version) {
        this._version = version;
      }
    });
  }

  private renderSetupBox() {
    if (this._updateStatus === undefined) { return this.renderUninstallBox(); }

    if (this._updateStatus === UpdateStatus.UpToDate) { return this.renderUninstallBox(); }

    const buttonLabel = this._updateStatus === UpdateStatus.Install
      ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug, })
      : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug, });

    return html`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug,
    })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${this.#onClickInstall}"
        >
        ${buttonLabel}
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_setupButtonDescription" .debug=${this._debug}>
          <p>
            This will create the document and data types needed for WYSIWYG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
    `;
  }

  private renderUpdateBox() {
    if (this._uninstalling || this._updateStatus === undefined) { return; }

    if (this._updateStatus !== UpdateStatus.UpToDate) { return; }

    const buttonLabel = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug, });

    return html`
      <uui-box headline=${this.localize.term("wysiwg_cultureSegmentTitle", {
      debug: this._debug,
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_cultureSegmentDescription" .debug=${this._debug}>
          <p>
            This will update the culture and segment settings for the WYSIWYG BlockGrid element types.
          </p>
        </umb-localize>
        <p>
          <uui-checkbox
            @change="${this.#onChangeCulture}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          color="positive"
          look="primary"
          @click="${this.#onClickUpdateSettings}"
        >
        ${buttonLabel}
        </uui-button>
      </uui-box>
    `;
  }

  private renderSegmentCheckbox() {
    if (this._version.major > 15 || (this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0)) {
      return html`
      <uui-checkbox
        disabled
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      `;
    }

    return html`
    <uui-checkbox
      @change="${this.#onChangeSegment}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }

  private renderUninstallBox() {
    if (this._updateStatus === undefined) { return; }
    if (this._updateStatus === UpdateStatus.Install) { return; }

    const buttonLabel = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug, });
    return html`
      <uui-box headline=${this.localize.term("wysiwg_uninstallTitle", {
      debug: this._debug,
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_uninstallButtonDescription" .debug=${this._debug}>
          <p>
            This will remove the document and data types needed for WYSIWYG block
            editor views.
          </p>
        </umb-localize>
        <uui-button
          color="danger"
          look="primary"
          @click="${this.#onClickUninstall}"
        >
        ${buttonLabel}
        </uui-button>
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

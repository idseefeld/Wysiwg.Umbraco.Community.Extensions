import { LitElement as C, property as m, state as g, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as S } from "@umbraco-cms/backoffice/property";
import { UMB_NOTIFICATION_CONTEXT as b } from "@umbraco-cms/backoffice/notification";
import { D as y, C as x, T } from "./constants-D3ye2K2u.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as O } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as E } from "./wysiwg.context-ll_B2PRz.js";
var w = Object.defineProperty, U = Object.getOwnPropertyDescriptor, u = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? U(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && w(e, i, s), s;
};
const k = "wysiwg-base.block-editor-custom-view";
let l = class extends _(C) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._commonUtilities = void 0, this._debug = y, this._notificationContext = void 0, this._workspaceContext = void 0, this.consumeContext(E, (t) => {
      t && this.observe(t.updateStatusCode, (e) => {
        e && (this.updateStatus = e);
      }, "_observeWysiwgBlockGridUpdateStatus");
    }), this.consumeContext(b, (t) => {
      this._notificationContext = t, this._commonUtilities = new x(this.localize, this._notificationContext);
    }), this.consumeContext(O, (t) => {
      var e;
      this._workspaceContext = t, this.observe((e = this._workspaceContext) == null ? void 0 : e.unique, (i) => {
        i && (this.documentUnique = i);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      S,
      async (t) => this.getSettings(t)
    );
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    try {
      super.disconnectedCallback(), this._workspaceContext = void 0, this._datasetContext = void 0, this._notificationContext = void 0, this._commonUtilities = void 0;
    } catch (t) {
      console.error("Error in disconnectedCallback:", t);
    }
  }
  update(t) {
    super.update(t), console.debug("update changedProperties:", t);
  }
  // protected async firstUpdated() {
  //   // console.debug("firstUpdated start");
  //   await this.setUpdateStatus();
  //   // console.debug("firstUpdated end");
  // }
  // protected async setUpdateStatus() {
  //   if (this.updateStatus) return;
  //   await this._commonUtilities?.getUpdateStatus(this._notificationContext).then((status) => {
  //     if (status) {
  //       this.updateStatus = status;
  //     }
  //   });
  // }
  getLayoutDataSettings() {
    var e, i;
    if (!((e = this.datasetSettings) != null && e.length))
      return;
    const t = this.layout;
    return (i = this.datasetSettings.filter(
      (o) => (t == null ? void 0 : t.settingsKey) === o.key
    )[0]) == null ? void 0 : i.values;
  }
  getLayoutSettings(t = "h1") {
    var h, d, r, p, f;
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!(i != null && i.length))
      return e;
    e.size = ((d = (h = i.filter((c) => c.alias === "size")[0]) == null ? void 0 : h.value) == null ? void 0 : d.toString().toLowerCase()) ?? e.size;
    const o = { value: "" }, s = ((r = i.filter((c) => c.alias === "color")[0]) == null ? void 0 : r.value) ?? o;
    s != null && s.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const n = ((p = i.filter((c) => c.alias === "margin")[0]) == null ? void 0 : p.value) ?? "";
    n && (e.inlineStyle += `margin: ${n};`);
    const a = (((f = i == null ? void 0 : i.find((c) => c.alias === "minHeight")) == null ? void 0 : f.value) ?? "0").toString();
    return a && (e.inlineStyle += `min-height: ${a};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === T || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    var e;
    this._datasetContext = t, this.observe(
      (e = this._datasetContext) == null ? void 0 : e.properties,
      async (i) => {
        var s;
        const o = i;
        if (o != null && o.length) {
          const n = o.filter((r) => r.editorAlias === "Umbraco.BlockGrid"), a = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          let h = n[0];
          if (n.length > 1)
            for (let r = 0; r < n.length; r++) {
              const p = n[r];
              if (p.alias && a.indexOf(p.alias) >= 0) {
                h = p;
                break;
              }
            }
          const d = h.value;
          this.prozessSettings(d), this.lastStepObservingProperties(o);
        }
      },
      "_observeProperties"
    );
  }
  async prozessSettings(t) {
    this.datasetSettings = t.settingsData;
  }
  async lastStepObservingProperties(t) {
  }
};
u([
  m({ attribute: !1 })
], l.prototype, "content", 2);
u([
  m({ attribute: !1 })
], l.prototype, "config", 2);
u([
  m({ attribute: !1 })
], l.prototype, "settings", 2);
u([
  g()
], l.prototype, "documentUnique", 2);
u([
  g()
], l.prototype, "datasetSettings", 2);
u([
  g()
], l.prototype, "updateStatus", 2);
l = u([
  v(k)
], l);
export {
  l as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view--GL6EEZz.js.map

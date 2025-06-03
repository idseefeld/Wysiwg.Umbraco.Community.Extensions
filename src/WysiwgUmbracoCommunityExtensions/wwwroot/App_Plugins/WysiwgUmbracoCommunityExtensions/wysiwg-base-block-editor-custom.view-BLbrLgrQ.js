import { LitElement as C, property as g, state as m, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as v } from "@umbraco-cms/backoffice/property";
import { UMB_NOTIFICATION_CONTEXT as y } from "@umbraco-cms/backoffice/notification";
import { D as b, C as x, T as U } from "./constants-D3ye2K2u.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as T } from "@umbraco-cms/backoffice/document";
var w = Object.defineProperty, O = Object.getOwnPropertyDescriptor, u = (t, e, i, n) => {
  for (var s = n > 1 ? void 0 : n ? O(e, i) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (s = (n ? a(e, i, s) : a(s)) || s);
  return n && s && w(e, i, s), s;
};
const E = "wysiwg-base.block-editor-custom-view";
let l = class extends _(C) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._commonUtilities = void 0, this._debug = b, this._notificationContext = void 0, this._workspaceContext = void 0, this.consumeContext(y, (t) => {
      this._notificationContext = t, this._commonUtilities = new x(this.localize, this._notificationContext);
    }), this.consumeContext(T, (t) => {
      var e;
      this._workspaceContext = t, this.observe((e = this._workspaceContext) == null ? void 0 : e.unique, (i) => {
        i && (this.documentUnique = i);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      v,
      async (t) => this.getSettings(t)
    );
  }
  async firstUpdated() {
    await this.setUpdateStatus();
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
  async setUpdateStatus() {
    var t;
    this.updateStatus || await ((t = this._commonUtilities) == null ? void 0 : t.getUpdateStatus(this._notificationContext).then((e) => {
      e && (this.updateStatus = e);
    }));
  }
  getLayoutDataSettings() {
    var e, i;
    if (!((e = this.datasetSettings) != null && e.length))
      return;
    const t = this.layout;
    return (i = this.datasetSettings.filter(
      (n) => (t == null ? void 0 : t.settingsKey) === n.key
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
    const n = { value: "" }, s = ((r = i.filter((c) => c.alias === "color")[0]) == null ? void 0 : r.value) ?? n;
    s != null && s.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const o = ((p = i.filter((c) => c.alias === "margin")[0]) == null ? void 0 : p.value) ?? "";
    o && (e.inlineStyle += `margin: ${o};`);
    const a = (((f = i == null ? void 0 : i.find((c) => c.alias === "minHeight")) == null ? void 0 : f.value) ?? "0").toString();
    return a && (e.inlineStyle += `min-height: ${a};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === U || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    var e;
    this._datasetContext = t, this.observe(
      (e = this._datasetContext) == null ? void 0 : e.properties,
      async (i) => {
        var s;
        const n = i;
        if (n != null && n.length) {
          const o = n.filter((r) => r.editorAlias === "Umbraco.BlockGrid"), a = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          let h = o[0];
          if (o.length > 1)
            for (let r = 0; r < o.length; r++) {
              const p = o[r];
              if (p.alias && a.indexOf(p.alias) >= 0) {
                h = p;
                break;
              }
            }
          const d = h.value;
          this.prozessSettings(d), this.lastStepObservingProperties(n);
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
  g({ attribute: !1 })
], l.prototype, "content", 2);
u([
  g({ attribute: !1 })
], l.prototype, "config", 2);
u([
  g({ attribute: !1 })
], l.prototype, "settings", 2);
u([
  m()
], l.prototype, "documentUnique", 2);
u([
  m()
], l.prototype, "datasetSettings", 2);
u([
  m()
], l.prototype, "updateStatus", 2);
l = u([
  S(E)
], l);
export {
  l as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-BLbrLgrQ.js.map

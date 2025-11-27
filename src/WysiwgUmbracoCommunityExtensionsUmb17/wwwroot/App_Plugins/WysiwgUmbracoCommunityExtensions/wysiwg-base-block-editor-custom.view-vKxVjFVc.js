import { LitElement as S, property as d, state as f, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as y } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as C } from "@umbraco-cms/backoffice/property";
import { D as b, T as _ } from "./constants-C2L7NEyy.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as E } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as O } from "./wysiwg.workspace.context-B9sJZpkf.js";
var T = Object.defineProperty, w = Object.getOwnPropertyDescriptor, c = (t, e, i, n) => {
  for (var s = n > 1 ? void 0 : n ? w(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (n ? r(e, i, s) : r(s)) || s);
  return n && s && T(e, i, s), s;
};
const x = "wysiwg-base.block-editor-custom-view";
let l = class extends y(S) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._debug = b, this._workspaceContext = void 0, this.consumeContext(O, (t) => {
      t && this.observe(t.updateStatusCode, (e) => {
        e && (this.updateStatus = e);
      }, "_observeWysiwgBlockGridUpdateStatus");
    }), this.consumeContext(E, (t) => {
      var e;
      this._workspaceContext = t, this.observe((e = this._workspaceContext) == null ? void 0 : e.unique, (i) => {
        i && (this.documentUnique = i);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      C,
      async (t) => this.getSettings(t)
    );
  }
  disconnectedCallback() {
    try {
      super.disconnectedCallback(), this._workspaceContext = void 0, this._datasetContext = void 0;
    } catch (t) {
      console.error("Error in disconnectedCallback:", t);
    }
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
    var g, h, a, p, m;
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!(i != null && i.length))
      return e;
    e.size = ((h = (g = i.filter((u) => u.alias === "size")[0]) == null ? void 0 : g.value) == null ? void 0 : h.toString().toLowerCase()) ?? e.size;
    const n = { value: "" }, s = ((a = i.filter((u) => u.alias === "color")[0]) == null ? void 0 : a.value) ?? n;
    s != null && s.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const o = ((p = i.filter((u) => u.alias === "margin")[0]) == null ? void 0 : p.value) ?? "";
    o && (e.inlineStyle += `margin: ${o};`);
    const r = (((m = i == null ? void 0 : i.find((u) => u.alias === "minHeight")) == null ? void 0 : m.value) ?? "0").toString();
    return r && (e.inlineStyle += `min-height: ${r};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === _ || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    var e;
    this._datasetContext = t, this.observe(
      (e = this._datasetContext) == null ? void 0 : e.properties,
      async (i) => {
        var s;
        const n = i;
        if (n != null && n.length) {
          const o = n.filter((a) => a.editorAlias === "Umbraco.BlockGrid"), r = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          let g = o[0];
          if (o.length > 1)
            for (let a = 0; a < o.length; a++) {
              const p = o[a];
              if (p.alias && r.indexOf(p.alias) >= 0) {
                g = p;
                break;
              }
            }
          const h = g.value;
          this.prozessSettings(h), this.lastStepObservingProperties(n);
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
c([
  d({ attribute: !1 })
], l.prototype, "content", 2);
c([
  d({ attribute: !1 })
], l.prototype, "config", 2);
c([
  d({ attribute: !1 })
], l.prototype, "settings", 2);
c([
  f()
], l.prototype, "documentUnique", 2);
c([
  f()
], l.prototype, "datasetSettings", 2);
c([
  f()
], l.prototype, "updateStatus", 2);
l = c([
  v(x)
], l);
export {
  l as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-vKxVjFVc.js.map

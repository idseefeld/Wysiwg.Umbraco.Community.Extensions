import { LitElement as C, property as d, state as f, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as T } from "@umbraco-cms/backoffice/property";
import { D as E, T as O } from "./constants-C2L7NEyy.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as w } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as x } from "./wysiwg.workspace.context-B9sJZpkf.js";
var k = Object.defineProperty, P = Object.getOwnPropertyDescriptor, c = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? P(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && k(e, i, s), s;
};
const D = "wysiwg-base.block-editor-custom-view";
let u = class extends _(C) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._debug = E, this._workspaceContext = void 0, this.consumeContext(x, (t) => {
      t && this.observe(t.updateStatusCode, (e) => {
        e && (this.updateStatus = e);
      }, "_observeWysiwgBlockGridUpdateStatus");
    }), this.consumeContext(w, (t) => {
      var e;
      this._workspaceContext = t, this.observe((e = this._workspaceContext) == null ? void 0 : e.unique, (i) => {
        i && (this.documentUnique = i);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      T,
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
      (a) => (t == null ? void 0 : t.settingsKey) === a.key
    )[0]) == null ? void 0 : i.values;
  }
  getLayoutSettings(t = "h1") {
    var l, p, m, v, S, y;
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!(i != null && i.length))
      return e;
    e.size = ((p = (l = i.filter((r) => r.alias === "size")[0]) == null ? void 0 : l.value) == null ? void 0 : p.toString().toLowerCase()) ?? e.size;
    const a = { value: "" }, s = ((m = i.filter((r) => r.alias === "color")[0]) == null ? void 0 : m.value) ?? a;
    s != null && s.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const o = { value: "" }, n = ((v = i.filter((r) => r.alias === "backgroundColor")[0]) == null ? void 0 : v.value) ?? o;
    n != null && n.value && n.value && !this.isTransparentColor(n.value) && (e.inlineStyle += `background-color: ${n.value};`);
    const g = ((S = i.filter((r) => r.alias === "margin")[0]) == null ? void 0 : S.value) ?? "";
    g && (e.inlineStyle += `margin: ${g};`);
    const h = (((y = i == null ? void 0 : i.find((r) => r.alias === "minHeight")) == null ? void 0 : y.value) ?? "0").toString();
    return h && (e.inlineStyle += `min-height: ${h};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === O || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    var e;
    this._datasetContext = t, this.observe(
      (e = this._datasetContext) == null ? void 0 : e.properties,
      async (i) => {
        var s;
        const a = i;
        if (a != null && a.length) {
          const o = a.filter((l) => l.editorAlias === "Umbraco.BlockGrid"), n = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          let g = o[0];
          if (o.length > 1)
            for (let l = 0; l < o.length; l++) {
              const p = o[l];
              if (p.alias && n.indexOf(p.alias) >= 0) {
                g = p;
                break;
              }
            }
          const h = g.value;
          this.prozessSettings(h), this.lastStepObservingProperties(a);
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
], u.prototype, "content", 2);
c([
  d({ attribute: !1 })
], u.prototype, "config", 2);
c([
  d({ attribute: !1 })
], u.prototype, "settings", 2);
c([
  f()
], u.prototype, "documentUnique", 2);
c([
  f()
], u.prototype, "datasetSettings", 2);
c([
  f()
], u.prototype, "updateStatus", 2);
u = c([
  b(D)
], u);
export {
  u as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-BXBLmnky.js.map

import { LitElement as h, property as p, state as d, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as m } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as v } from "@umbraco-cms/backoffice/property";
import { D as S, T as y } from "./constants-C2L7NEyy.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as C } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as b } from "./wysiwg.workspace.context-CeinJtuE.js";
var _ = Object.defineProperty, T = Object.getOwnPropertyDescriptor, c = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? T(e, i) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (s = (o ? n(e, i, s) : n(s)) || s);
  return o && s && _(e, i, s), s;
};
const E = "wysiwg-base.block-editor-custom-view";
let u = class extends m(h) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._debug = S, this._workspaceContext = void 0, this.consumeContext(b, (t) => {
      t && this.observe(t.updateStatusCode, (e) => {
        e && (this.updateStatus = e);
      }, "_observeWysiwgBlockGridUpdateStatus");
    }), this.consumeContext(C, (t) => {
      this._workspaceContext = t, this.observe(this._workspaceContext?.unique, (e) => {
        e && (this.documentUnique = e);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      v,
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
    if (!this.datasetSettings?.length)
      return;
    const t = this.layout;
    return this.datasetSettings.filter(
      (e) => t?.settingsKey === e.key
    )[0]?.values;
  }
  getLayoutSettings(t = "h1") {
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!i?.length)
      return e;
    e.size = i.filter((r) => r.alias === "size")[0]?.value?.toString().toLowerCase() ?? e.size;
    const o = { value: "" }, s = i.filter((r) => r.alias === "color")[0]?.value ?? o;
    s?.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const a = { value: "" }, n = i.filter((r) => r.alias === "backgroundColor")[0]?.value ?? a;
    n?.value && n.value && !this.isTransparentColor(n.value) && (e.inlineStyle += `background-color: ${n.value};`);
    const l = i.filter((r) => r.alias === "margin")[0]?.value ?? "";
    l && (e.inlineStyle += `margin: ${l};`);
    const g = (i?.find((r) => r.alias === "minHeight")?.value ?? "0").toString();
    return g && (e.inlineStyle += `min-height: ${g};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === y || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    this._datasetContext = t, this.observe(
      this._datasetContext?.properties,
      async (e) => {
        const i = e;
        if (i?.length) {
          const o = i.filter((l) => l.editorAlias === "Umbraco.BlockGrid"), s = this.config?.editSettingsPath ?? "";
          let a = o[0];
          if (o.length > 1)
            for (let l = 0; l < o.length; l++) {
              const g = o[l];
              if (g.alias && s.indexOf(g.alias) >= 0) {
                a = g;
                break;
              }
            }
          const n = a.value;
          this.prozessSettings(n), this.lastStepObservingProperties(i);
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
  p({ attribute: !1 })
], u.prototype, "content", 2);
c([
  p({ attribute: !1 })
], u.prototype, "config", 2);
c([
  p({ attribute: !1 })
], u.prototype, "settings", 2);
c([
  d()
], u.prototype, "documentUnique", 2);
c([
  d()
], u.prototype, "datasetSettings", 2);
c([
  d()
], u.prototype, "updateStatus", 2);
u = c([
  f(E)
], u);
export {
  u as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-BoT8cJ6_.js.map

import { LitElement as h, css as f, property as p, state as d, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as S } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as v } from "@umbraco-cms/backoffice/property";
import { D as y, T as b } from "./constants-B4oFBJqb.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as C } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as _ } from "./wysiwg.workspace.context-DCYqdiaY.js";
import { UmbTextStyles as k } from "@umbraco-cms/backoffice/style";
var T = Object.defineProperty, x = Object.getOwnPropertyDescriptor, u = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? x(e, i) : e, l = t.length - 1, r; l >= 0; l--)
    (r = t[l]) && (s = (o ? r(e, i, s) : r(s)) || s);
  return o && s && T(e, i, s), s;
};
const E = "wysiwg-base.block-editor-custom-view";
let a = class extends S(h) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._debug = y, this._workspaceContext = void 0, this.consumeContext(_, (t) => {
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
  setEditorLink(t) {
    return `<a id="editor-link" href="${this.config?.editContentPath ?? ""}">${t}</a>`;
  }
  getLayoutSettings(t = "h1") {
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!i?.length)
      return e;
    e.size = i.filter((n) => n.alias === "size")[0]?.value?.toString().toLowerCase() ?? e.size;
    const o = { value: "" }, s = i.filter((n) => n.alias === "color")[0]?.value ?? o;
    s?.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const l = { value: "" }, r = i.filter((n) => n.alias === "backgroundColor")[0]?.value ?? l;
    r?.value && r.value && !this.isTransparentColor(r.value) && (e.inlineStyle += `background-color: ${r.value};`);
    const c = i.filter((n) => n.alias === "margin")[0]?.value ?? "";
    c && (e.inlineStyle += `margin: ${c};`);
    const g = (i?.find((n) => n.alias === "minHeight")?.value ?? "0").toString();
    return g && (e.inlineStyle += `min-height: ${g};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === b || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    this._datasetContext = t, this.observe(
      this._datasetContext?.properties,
      async (e) => {
        const i = e;
        if (i?.length) {
          const o = i.filter((c) => c.editorAlias === "Umbraco.BlockGrid"), s = this.config?.editSettingsPath ?? "";
          let l = o[0];
          if (o.length > 1)
            for (let c = 0; c < o.length; c++) {
              const g = o[c];
              if (g.alias && s.indexOf(g.alias) >= 0) {
                l = g;
                break;
              }
            }
          const r = l.value;
          this.prozessSettings(r), this.lastStepObservingProperties(i);
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
a.baseStyles = [
  k,
  f`
       a#editor-link{
        color: initial;
        text-decoration: none;
        cursor: pointer;
       }
       a#editor-link:hover{
        color: inherit;
        cursor: pointer;
       }
    `
];
u([
  p({ attribute: !1 })
], a.prototype, "content", 2);
u([
  p({ attribute: !1 })
], a.prototype, "config", 2);
u([
  p({ attribute: !1 })
], a.prototype, "settings", 2);
u([
  d()
], a.prototype, "documentUnique", 2);
u([
  d()
], a.prototype, "datasetSettings", 2);
u([
  d()
], a.prototype, "updateStatus", 2);
a = u([
  m(E)
], a);
export {
  a as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-CCHW93dJ.js.map

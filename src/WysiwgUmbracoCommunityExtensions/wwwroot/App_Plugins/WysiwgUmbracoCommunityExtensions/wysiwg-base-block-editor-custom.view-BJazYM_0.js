import { LitElement as d, unsafeHTML as f, html as m, css as S, property as p, state as h, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as y } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as b } from "@umbraco-cms/backoffice/property";
import { D as C, T as _ } from "./constants-B4oFBJqb.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as E } from "@umbraco-cms/backoffice/document";
import { WYSIWG_BLOCKGRID_CONTEXT as T } from "./wysiwg.workspace.context-DTny7t4O.js";
import { UmbTextStyles as k } from "@umbraco-cms/backoffice/style";
function w(t) {
  let e;
  try {
    e = new URL(t, document.baseURI);
  } catch {
    return;
  }
  e.origin === location.origin && history.pushState(null, "", e);
}
var x = Object.defineProperty, O = Object.getOwnPropertyDescriptor, c = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? O(e, i) : e, l = t.length - 1, r; l >= 0; l--)
    (r = t[l]) && (s = (o ? r(e, i, s) : r(s)) || s);
  return o && s && x(e, i, s), s;
};
const P = "wysiwg-base.block-editor-custom-view";
let n = class extends y(d) {
  constructor() {
    super(), this._href = "", this.documentUnique = "", this.updateStatus = void 0, this._debug = C, this._workspaceContext = void 0, this.consumeContext(T, (t) => {
      t && this.observe(t.updateStatusCode, (e) => {
        e && (this.updateStatus = e);
      }, "_observeWysiwgBlockGridUpdateStatus");
    }), this.consumeContext(E, (t) => {
      this._workspaceContext = t, this.observe(this._workspaceContext?.unique, (e) => {
        e && (this.documentUnique = e);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      b,
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
  openEditorDialog() {
    w(this._href);
  }
  setEditorLink(t) {
    return this._href = this.config?.editContentPath ?? "", m`
      <div id="edit-button" @click="${this.openEditorDialog}">
        ${f(t)}
      </div>
    `;
  }
  getLayoutSettings(t = "h1") {
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!i?.length)
      return e;
    e.size = i.filter((a) => a.alias === "size")[0]?.value?.toString().toLowerCase() ?? e.size;
    const o = { value: "" }, s = i.filter((a) => a.alias === "color")[0]?.value ?? o;
    s?.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const l = { value: "" }, r = i.filter((a) => a.alias === "backgroundColor")[0]?.value ?? l;
    r?.value && r.value && !this.isTransparentColor(r.value) && (e.inlineStyle += `background-color: ${r.value};`);
    const u = i.filter((a) => a.alias === "margin")[0]?.value ?? "";
    u && (e.inlineStyle += `margin: ${u};`);
    const g = (i?.find((a) => a.alias === "minHeight")?.value ?? "0").toString();
    return g && (e.inlineStyle += `min-height: ${g};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === _ || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    this._datasetContext = t, this.observe(
      this._datasetContext?.properties,
      async (e) => {
        const i = e;
        if (i?.length) {
          const o = i.filter((u) => u.editorAlias === "Umbraco.BlockGrid"), s = this.config?.editSettingsPath ?? "";
          let l = o[0];
          if (o.length > 1)
            for (let u = 0; u < o.length; u++) {
              const g = o[u];
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
n.baseStyles = [
  k,
  S`
      #edit-button{
        cursor: pointer;
      }
    `
];
c([
  p({ attribute: !1 })
], n.prototype, "content", 2);
c([
  p({ attribute: !1 })
], n.prototype, "config", 2);
c([
  p({ attribute: !1 })
], n.prototype, "settings", 2);
c([
  p({ attribute: !1 })
], n.prototype, "_href", 2);
c([
  h()
], n.prototype, "documentUnique", 2);
c([
  h()
], n.prototype, "datasetSettings", 2);
c([
  h()
], n.prototype, "updateStatus", 2);
n = c([
  v(P)
], n);
export {
  n as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-BJazYM_0.js.map

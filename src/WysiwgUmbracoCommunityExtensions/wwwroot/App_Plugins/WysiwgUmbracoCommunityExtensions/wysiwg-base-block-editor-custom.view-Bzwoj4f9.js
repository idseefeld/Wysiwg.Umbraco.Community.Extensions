import { LitElement as T, property as y, state as C, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as O } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as k } from "@umbraco-cms/backoffice/property";
import { UMB_NOTIFICATION_CONTEXT as P } from "@umbraco-cms/backoffice/notification";
import { D as x, C as D, T as M } from "./constants-D3ye2K2u.js";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as W } from "@umbraco-cms/backoffice/document";
var z = Object.defineProperty, B = Object.getOwnPropertyDescriptor, b = (t) => {
  throw TypeError(t);
}, p = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? B(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && z(e, i, s), s;
}, w = (t, e, i) => e.has(t) || b("Cannot " + i), S = (t, e, i) => (w(t, e, "read from private field"), i ? i.call(t) : e.get(t)), _ = (t, e, i) => e.has(t) ? b("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), h = (t, e, i, a) => (w(t, e, "write to private field"), e.set(t, i), i), f, d, m;
const N = "wysiwg-base.block-editor-custom-view";
let l = class extends O(T) {
  constructor() {
    super(), this.documentUnique = "", this.updateStatus = void 0, this._commonUtilities = void 0, this._debug = x, _(this, f), _(this, d), _(this, m), this.consumeContext(P, (t) => {
      h(this, d, t), this._commonUtilities = new D(this.localize, S(this, d));
    }), this.consumeContext(W, (t) => {
      var e;
      h(this, m, t), this.observe((e = S(this, m)) == null ? void 0 : e.unique, (i) => {
        i && (this.documentUnique = i);
      }, "_observeWorkspaceStatus");
    }), this.consumeContext(
      k,
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
      super.disconnectedCallback(), h(this, m, void 0), h(this, f, void 0), h(this, d, void 0), this._commonUtilities = void 0;
    } catch (t) {
      console.error("Error in disconnectedCallback:", t);
    }
  }
  update(t) {
    super.update(t), console.debug("update changedProperties:", t);
  }
  async setUpdateStatus() {
    var t;
    this.updateStatus || await ((t = this._commonUtilities) == null ? void 0 : t.getUpdateStatus(S(this, d)).then((e) => {
      e && (this.updateStatus = e);
    }));
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
    var g, v, o, u, U;
    const e = {
      size: t,
      inlineStyle: ""
    }, i = this.getLayoutDataSettings();
    if (!(i != null && i.length))
      return e;
    e.size = ((v = (g = i.filter((c) => c.alias === "size")[0]) == null ? void 0 : g.value) == null ? void 0 : v.toString().toLowerCase()) ?? e.size;
    const a = { value: "" }, s = ((o = i.filter((c) => c.alias === "color")[0]) == null ? void 0 : o.value) ?? a;
    s != null && s.value && s.value && !this.isTransparentColor(s.value) && (e.inlineStyle = `color: ${s.value};`);
    const n = ((u = i.filter((c) => c.alias === "margin")[0]) == null ? void 0 : u.value) ?? "";
    n && (e.inlineStyle += `margin: ${n};`);
    const r = (((U = i == null ? void 0 : i.find((c) => c.alias === "minHeight")) == null ? void 0 : U.value) ?? "0").toString();
    return r && (e.inlineStyle += `min-height: ${r};`), e.inlineStyle && (e.inlineStyle = `style="${e.inlineStyle}"`), e;
  }
  isTransparentColor(t) {
    return t === M || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(255, 255, 255, 0)";
  }
  async getSettings(t) {
    var e;
    h(this, f, t), this.observe(
      (e = S(this, f)) == null ? void 0 : e.properties,
      async (i) => {
        var s;
        const a = i;
        if (a != null && a.length) {
          const n = a.filter((o) => o.editorAlias === "Umbraco.BlockGrid"), r = ((s = this.config) == null ? void 0 : s.editSettingsPath) ?? "";
          let g = n[0];
          if (n.length > 1)
            for (let o = 0; o < n.length; o++) {
              const u = n[o];
              if (u.alias && r.indexOf(u.alias) >= 0) {
                g = u;
                break;
              }
            }
          const v = g.value;
          this.prozessSettings(v), this.lastStepObservingProperties(a);
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
f = /* @__PURE__ */ new WeakMap();
d = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
p([
  y({ attribute: !1 })
], l.prototype, "content", 2);
p([
  y({ attribute: !1 })
], l.prototype, "config", 2);
p([
  y({ attribute: !1 })
], l.prototype, "settings", 2);
p([
  C()
], l.prototype, "documentUnique", 2);
p([
  C()
], l.prototype, "datasetSettings", 2);
p([
  C()
], l.prototype, "updateStatus", 2);
l = p([
  E(N)
], l);
export {
  l as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-Bzwoj4f9.js.map

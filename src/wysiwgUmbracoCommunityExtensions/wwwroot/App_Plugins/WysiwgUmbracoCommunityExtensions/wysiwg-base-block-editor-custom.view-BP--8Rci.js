import { LitElement as u, property as g, state as m, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as S } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as E } from "@umbraco-cms/backoffice/property";
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, h = (t) => {
  throw TypeError(t);
}, l = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? C(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && w(e, s, i), i;
}, v = (t, e, s) => e.has(t) || h("Cannot " + s), P = (t, e, s) => (v(t, e, "read from private field"), e.get(t)), O = (t, e, s) => e.has(t) ? h("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), T = (t, e, s, r) => (v(t, e, "write to private field"), e.set(t, s), s), c;
const b = "#fff", x = "wysiwg-base.block-editor-custom-view";
let o = class extends S(u) {
  constructor() {
    super(), O(this, c), this.consumeContext(
      E,
      async (t) => this.getSettings(t)
    );
  }
  isTransparentColor(t) {
    return t === b;
  }
  async getSettings(t) {
    var e;
    T(this, c, t), this.observe(
      (e = P(this, c)) == null ? void 0 : e.properties,
      async (s) => {
        var i;
        const r = s;
        if (r != null && r.length) {
          const a = r.filter((p) => p.editorAlias === "Umbraco.BlockGrid"), n = ((i = this.config) == null ? void 0 : i.editSettingsPath) ?? "";
          let d = a[0];
          if (a.length > 1)
            for (let p = 0; p < a.length; p++) {
              const f = a[p];
              if (f.alias && n.indexOf(f.alias) >= 0) {
                d = f;
                break;
              }
            }
          const _ = d.value;
          this.prozessSettings(_), this.lastStepObservingProperties(r);
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
c = /* @__PURE__ */ new WeakMap();
l([
  g({ attribute: !1 })
], o.prototype, "content", 2);
l([
  g({ attribute: !1 })
], o.prototype, "config", 2);
l([
  g({ attribute: !1 })
], o.prototype, "settings", 2);
l([
  m()
], o.prototype, "datasetSettings", 2);
o = l([
  y(x)
], o);
export {
  o as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-BP--8Rci.js.map

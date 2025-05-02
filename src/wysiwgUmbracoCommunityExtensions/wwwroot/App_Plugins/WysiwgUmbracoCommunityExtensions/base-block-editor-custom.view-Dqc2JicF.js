import { LitElement as u, property as g, state as m, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as S } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as E } from "@umbraco-cms/backoffice/property";
var w = Object.defineProperty, P = Object.getOwnPropertyDescriptor, h = (t) => {
  throw TypeError(t);
}, c = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? P(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && w(e, s, i), i;
}, v = (t, e, s) => e.has(t) || h("Cannot " + s), C = (t, e, s) => (v(t, e, "read from private field"), e.get(t)), O = (t, e, s) => e.has(t) ? h("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), b = (t, e, s, r) => (v(t, e, "write to private field"), e.set(t, s), s), l;
const D = "#fff", x = "wysiwg-base.block-editor-custom-view";
let o = class extends S(u) {
  constructor() {
    super(), O(this, l), this.consumeContext(
      E,
      async (t) => this.getSettings(t)
    );
  }
  async getSettings(t) {
    var e;
    b(this, l, t), this.observe(
      (e = C(this, l)) == null ? void 0 : e.properties,
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
l = /* @__PURE__ */ new WeakMap();
c([
  g({ attribute: !1 })
], o.prototype, "content", 2);
c([
  g({ attribute: !1 })
], o.prototype, "config", 2);
c([
  g({ attribute: !1 })
], o.prototype, "settings", 2);
c([
  m()
], o.prototype, "datasetSettings", 2);
o = c([
  y(x)
], o);
export {
  o as W,
  D as t
};
//# sourceMappingURL=base-block-editor-custom.view-Dqc2JicF.js.map

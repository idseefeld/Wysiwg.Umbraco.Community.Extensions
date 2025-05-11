import { LitElement as w, property as u, state as v, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as E } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as O } from "@umbraco-cms/backoffice/property";
import { UMB_NOTIFICATION_CONTEXT as P } from "@umbraco-cms/backoffice/notification";
import { D as U, C as b, T as x } from "./constants-BvAuY3a0.js";
var B = Object.defineProperty, D = Object.getOwnPropertyDescriptor, S = (t) => {
  throw TypeError(t);
}, n = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? D(e, s) : e, r = t.length - 1, p; r >= 0; r--)
    (p = t[r]) && (a = (i ? p(e, s, a) : p(a)) || a);
  return i && a && B(e, s, a), a;
}, y = (t, e, s) => e.has(t) || S("Cannot " + s), g = (t, e, s) => (y(t, e, "read from private field"), s ? s.call(t) : e.get(t)), _ = (t, e, s) => e.has(t) ? S("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), m = (t, e, s, i) => (y(t, e, "write to private field"), e.set(t, s), s), c, h;
const A = "wysiwg-base.block-editor-custom-view";
let o = class extends E(w) {
  constructor() {
    super(), this.updateStatus = void 0, this._commonUtilities = void 0, this._debug = U, _(this, c), _(this, h), this.consumeContext(P, (t) => {
      m(this, h, t), this._commonUtilities = new b(this.localize, t);
    }), this.consumeContext(
      O,
      async (t) => this.getSettings(t)
    );
  }
  async setUpdateStatus() {
    var t;
    this.updateStatus || await ((t = this._commonUtilities) == null ? void 0 : t.getUpdateStatus(g(this, h)).then((e) => {
      e && (this.updateStatus = e);
    }));
  }
  isTransparentColor(t) {
    return t === x;
  }
  async getSettings(t) {
    var e;
    m(this, c, t), this.observe(
      (e = g(this, c)) == null ? void 0 : e.properties,
      async (s) => {
        var a;
        const i = s;
        if (i != null && i.length) {
          const r = i.filter((l) => l.editorAlias === "Umbraco.BlockGrid"), p = ((a = this.config) == null ? void 0 : a.editSettingsPath) ?? "";
          let f = r[0];
          if (r.length > 1)
            for (let l = 0; l < r.length; l++) {
              const d = r[l];
              if (d.alias && p.indexOf(d.alias) >= 0) {
                f = d;
                break;
              }
            }
          const C = f.value;
          this.prozessSettings(C), this.lastStepObservingProperties(i);
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
h = /* @__PURE__ */ new WeakMap();
n([
  u({ attribute: !1 })
], o.prototype, "content", 2);
n([
  u({ attribute: !1 })
], o.prototype, "config", 2);
n([
  u({ attribute: !1 })
], o.prototype, "settings", 2);
n([
  v()
], o.prototype, "datasetSettings", 2);
n([
  v()
], o.prototype, "updateStatus", 2);
o = n([
  T(A)
], o);
export {
  o as W
};
//# sourceMappingURL=wysiwg-base-block-editor-custom.view-CYVB1wdx.js.map

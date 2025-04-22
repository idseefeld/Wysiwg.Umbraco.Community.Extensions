import { UmbTextStyles as b } from "@umbraco-cms/backoffice/style";
import { LitElement as C, unsafeHTML as z, html as E, css as P, property as y, state as $, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as O } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as k } from "@umbraco-cms/backoffice/property";
var B = Object.defineProperty, D = Object.getOwnPropertyDescriptor, S = (t) => {
  throw TypeError(t);
}, v = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? D(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && B(e, i, a), a;
}, x = (t, e, i) => e.has(t) || S("Cannot " + i), G = (t, e, i) => (x(t, e, "read from private field"), e.get(t)), H = (t, e, i) => e.has(t) ? S("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), A = (t, e, i, s) => (x(t, e, "write to private field"), e.set(t, i), i), p;
const M = "wysiwg-block-headline-view";
let o = class extends O(C) {
  constructor() {
    super(), this.defaultColor = { label: "Black", value: "#000" }, H(this, p), this.consumeContext(
      k,
      async (t) => this.getSettings(t)
    );
  }
  async getSettings(t) {
    var e;
    A(this, p, t), this.observe(
      (e = G(this, p)) == null ? void 0 : e.properties,
      async (i) => {
        var a, r;
        const s = i;
        if (s != null && s.length) {
          const n = s.filter((l) => l.editorAlias === "Umbraco.BlockGrid"), f = ((a = this.config) == null ? void 0 : a.editSettingsPath) ?? "";
          console.debug("editSettingsPath: ", f);
          let g = n[0];
          if (n.length > 1)
            for (let l = 0; l < n.length; l++) {
              const d = n[l];
              if (d.alias && f.indexOf(d.alias) >= 0) {
                g = d;
                break;
              }
            }
          const c = g.value;
          console.debug("thisGrid.alias: ", g.alias), (r = c.settingsData) != null && r.length && (this.datasetSettings = c.settingsData);
        }
      },
      "_observeProperties"
    );
  }
  render() {
    var a, r, n, f, g, c, l, d;
    let t = "h1", e = "";
    if ((a = this.datasetSettings) != null && a.length) {
      const w = this.layout, m = (r = this.datasetSettings.filter(
        (h) => (w == null ? void 0 : w.settingsKey) === h.key
      )[0]) == null ? void 0 : r.values;
      t = ((f = (n = m.filter((h) => h.alias === "size")[0]) == null ? void 0 : n.value) == null ? void 0 : f.toString().toLowerCase()) ?? t;
      const u = ((c = (g = m.filter((h) => h.alias === "color")[0]) == null ? void 0 : g.value) == null ? void 0 : c.value) ?? this.defaultColor.value;
      u && (e = `color: ${u};`);
      const _ = ((l = m.filter((h) => h.alias === "margin")[0]) == null ? void 0 : l.value) ?? "";
      _ && (e += `margin: ${_};`), e && (e = `style="${e}"`);
    }
    const i = ((d = this.content) == null ? void 0 : d.text) ?? "Headline", s = `<${t} ${e}>${i}</${t}>`;
    return E`${z(s)}`;
  }
};
p = /* @__PURE__ */ new WeakMap();
o.styles = [
  b,
  P`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      h1, h2, h3 {
        margin: 0;
      }
      h1 {
        font-size: var(--wysiwg-headline-1-font-size, 32px);
        line-height: var(--wysiwg-headline-1-line-height, 1.2em);
        margin: var(--wysiwg-headline-1-margin, 0);
      }
      h2 {
        font-size: var(--wysiwg-headline-2-font-size, 28px);
        line-height: var(--wysiwg-headline-2-line-height, 1.2em);
        margin: var(--wysiwg-headline-2-margin, 0);
      }
      h3 {
        font-size: var(--wysiwg-headline-3-font-size , 24px);
        line-height: var(--wysiwg-headline-3-line-height, 1.2em);
        margin: var(--wysiwg-headline-3-margin, 0);
      }
    `
];
v([
  y({ attribute: !1 })
], o.prototype, "content", 2);
v([
  y({ attribute: !1 })
], o.prototype, "config", 2);
v([
  y({ attribute: !1 })
], o.prototype, "settings", 2);
v([
  $()
], o.prototype, "datasetSettings", 2);
o = v([
  T(M)
], o);
const N = o;
export {
  o as WysiwgBlockHeadlineView,
  N as default
};
//# sourceMappingURL=headline.view-Bp4C2aJl.js.map

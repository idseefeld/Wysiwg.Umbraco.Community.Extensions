import { UmbTextStyles as y } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as m, html as f, css as u, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { W as k } from "./wysiwg-base-block-editor-custom.view-DVhqiDDI.js";
var z = Object.getOwnPropertyDescriptor, b = (t, e, a, r) => {
  for (var i = r > 1 ? void 0 : r ? z(e, a) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (i = o(i) || i);
  return i;
};
const $ = "wysiwg-block-paragraph-view";
let g = class extends k {
  update(t) {
    var e;
    if (super.update(t), t.has("content")) {
      const a = (e = this.shadowRoot) == null ? void 0 : e.querySelector("div.paragraph");
      if (!a) return;
      const r = a.querySelector("a");
      r && r.addEventListener("click", (i) => {
        i.preventDefault();
      }), this.requestUpdate();
    }
  }
  render() {
    var s, o, p, v, c;
    let t = { value: "" }, e = "";
    if ((s = this.datasetSettings) != null && s.length) {
      const w = this.layout, h = (o = this.datasetSettings.filter(
        (l) => (w == null ? void 0 : w.settingsKey) === l.key
      )[0]) == null ? void 0 : o.values, n = ((p = h.filter((l) => l.alias === "color")[0]) == null ? void 0 : p.value) ?? t;
      n != null && n.value && (e = `color: ${n == null ? void 0 : n.value};`);
      const d = (((v = h == null ? void 0 : h.find((l) => l.alias === "minHeight")) == null ? void 0 : v.value) ?? "0").toString();
      d && (e += `min-height: ${d};`);
    }
    e && (e = `style="${e}"`);
    var a = (c = this.content) == null ? void 0 : c.text, r = a == null ? void 0 : a.markup;
    const i = `<div class="paragraph" ${e}>${r}</div>`;
    return f`${m(i)}`;
  }
};
g.styles = [
  y,
  u`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .paragraph {
        font-size: var(--wysiwg-font-size-16);
        line-height: var(--wysiwg-line-height-24);
        text-shadow: var(--wysiwg-paragraph-text-shadow, none);
      }
      h2, h3{
        color: var(--wysiwg-paragraph-headline-color, inherit);
        text-shadow: var(--wysiwg-paragraph-headline-text-shadow, none);
      }
      h2 {
        font-size: var(--wysiwg-font-size-24, 24px);
        line-height: var(--wysiwg-line-height-28, 28px);
        margin: var(--wysiwg-headline-paragraph-2-margin, 0);
      }

      h3 {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-headline-paragraph-3-margin, 0);
      }

      p
      {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-p-paragraph-margin, 0);
        padding: var(--wysiwg-p-paragraph-padding, 0);
      }

      a{
        color: inherit;
        text-decoration: var(--wysiwg-link-text-decoration, underline);
      }

      a:hover{
        color: var(--wysiwg-link-hover-color, inherit);
      }
    `
];
g = b([
  x($)
], g);
const S = g;
export {
  g as WysiwgBlockParagraphView,
  S as default
};
//# sourceMappingURL=paragraph.view-DH-GiC5k.js.map

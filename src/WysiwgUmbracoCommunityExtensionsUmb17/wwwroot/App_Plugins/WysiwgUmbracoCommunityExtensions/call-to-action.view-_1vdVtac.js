import { unsafeHTML as e, html as g, css as w, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as s } from "./wysiwg-base-block-editor-custom.view-CCHW93dJ.js";
var b = Object.getOwnPropertyDescriptor, y = (a, n, c, o) => {
  for (var t = o > 1 ? void 0 : o ? b(n, c) : n, i = a.length - 1, l; i >= 0; i--)
    (l = a[i]) && (t = l(t) || t);
  return t;
};
const m = "wysiwg-block-call-to-action-view";
let r = class extends s {
  render() {
    const a = this.getLayoutSettings(), n = this.content?.label ?? "Call to Action", o = (this.content?.actionOrUrl ?? [])[0]?.url ?? "#", t = "javascript:", i = o.substring(0, t.length) === t ? o.substring(t.length) : `location.href='${o}'`, l = `<div class="call-to-action"><button ${a.inlineStyle} title="${i}">${n}</button></div>`;
    return g`${e(this.setEditorLink(l))}`;
  }
};
r.styles = [
  s.baseStyles,
  w`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .call-to-action button {
        display: inline-block;
      }
      .call-to-action button {
        cursor: pointer;
        background-color: var(--wysiwg-call-to-action-background-color, initial);
        color: var(--wysiwg-call-to-action-color, initial);
        border: var(--wysiwg-call-to-action-border, none);
        padding: var(--wysiwg-call-to-action-padding, 0.5em 1em);
        font-size: var(--wysiwg-call-to-action-font-size, 1em);
        border-radius: var(--wysiwg-call-to-action-border-radius, 0.5em);
        box-shadow: var(--wysiwg-call-to-action-box-shadow, rgba(0,0,0,0.3) 5px 10px 10px);
      }
      .call-to-action button:active {
        margin-left: var(--wysiwg-call-to-action-active-margin-left, 10px);
        margin-top: var(--wysiwg-call-to-action-active-margin-top, 10px);
        box-shadow: none;
      }
    `
];
r = y([
  d(m)
], r);
const p = r;
export {
  r as WysiwgBlockCallToActionView,
  p as default
};
//# sourceMappingURL=call-to-action.view-_1vdVtac.js.map

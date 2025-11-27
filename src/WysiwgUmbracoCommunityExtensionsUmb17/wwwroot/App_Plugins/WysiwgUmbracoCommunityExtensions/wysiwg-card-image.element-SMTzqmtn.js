import { css as x, property as h, state as _, customElement as z, html as a, nothing as f, ifDefined as d } from "@umbraco-cms/backoffice/external/lit";
import { UUICardElement as y, demandCustomElement as v } from "@umbraco-cms/backoffice/external/uui";
var $ = Object.defineProperty, C = Object.getOwnPropertyDescriptor, b = (e) => {
  throw TypeError(e);
}, n = (e, t, i, l) => {
  for (var o = l > 1 ? void 0 : l ? C(t, i) : t, p = e.length - 1, u; p >= 0; p--)
    (u = e[p]) && (o = (l ? u(t, i, o) : u(o)) || o);
  return l && o && $(t, i, o), o;
}, E = (e, t, i) => t.has(e) || b("Cannot " + i), k = (e, t, i) => t.has(e) ? b("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), c = (e, t, i) => (E(e, t, "access private method"), i), s, g, w, m;
const P = "wysiwg-card-image";
let r = class extends y {
  constructor() {
    super(...arguments), k(this, s), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), v(this, "uui-symbol-folder"), v(this, "uui-symbol-file");
  }
  queryPreviews(e) {
    this.hasPreview = e.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? a`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : a`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return a` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? c(this, s, w).call(this) : c(this, s, g).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
s = /* @__PURE__ */ new WeakSet();
g = function() {
  return a`
      <button
        id="open-part"
        tabindex=${this.disabled ? f : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${c(this, s, m).call(this)}
      </button>
    `;
};
w = function() {
  return a`
      <a
        id="open-part"
        tabindex=${this.disabled ? f : "0"}
        href=${d(this.disabled ? void 0 : this.href)}
        target=${d(this.target || void 0)}
        rel=${d(
    this.rel || d(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${c(this, s, m).call(this)}
      </a>
    `;
};
m = function() {
  return a`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
r.styles = [
  ...y.styles,
  x`
      #entity-symbol {
        align-self: center;
        width: 60%;
        margin-bottom: var(--uui-size-layout-1);
        padding: var(--uui-size-space-6);
      }

      slot[name='tag'] {
        position: absolute;
        top: var(--uui-size-4);
        right: var(--uui-size-4);
        display: flex;
        justify-content: right;
        z-index: 2;
      }

      slot[name='actions'] {
        position: absolute;
        top: var(--uui-size-4);
        right: var(--uui-size-4);
        display: flex;
        justify-content: right;
        z-index: 2;
        opacity: 0;
        transition: opacity 120ms;
      }
      :host(:focus) slot[name='actions'],
      :host(:focus-within) slot[name='actions'],
      :host(:hover) slot[name='actions'] {
        opacity: 1;
      }

      slot:not([name])::slotted(*) {
        align-self: center;
        border-radius: var(--uui-border-radius);
        object-fit: cover;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      #open-part {
        position: absolute;
        z-index: 1;
        inset: 0;
        color: var(--uui-color-interactive);
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      :host([disabled]) #open-part {
        pointer-events: none;
        color: var(--uui-color-contrast-disabled);
      }

      #open-part:hover {
        color: var(--uui-color-interactive-emphasis);
      }
      #open-part:hover #name {
        text-decoration: underline;
      }

      #open-part #name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: anywhere;
      }

      :host([image]:not([image=''])) #open-part {
        transition: opacity 0.5s 0.5s;
        opacity: 0;
      }

      #content {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        font-family: inherit;
        box-sizing: border-box;
        text-align: left;
        word-break: break-word;
        padding-top: var(--uui-size-space-3);
        opacity: 0.5;
      }
      #content:hover {
        opacity: 1;
      }
      #content::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-top: 1px solid var(--uui-color-divider);
        border-radius: 0 0 var(--uui-border-radius) var(--uui-border-radius);
        background-color: var(--uui-color-surface);
        pointer-events: none;
        opacity: 0.96;
      }

      #detail {
        opacity: 0.6;
      }

      .ellipse{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :host(
          [image]:not([image='']):hover,
          [image]:not([image='']):focus,
          [image]:not([image='']):focus-within,
          [selected][image]:not([image='']),
          [error][image]:not([image=''])
        )
        #open-part {
        opacity: 1;
        transition-duration: 120ms;
        transition-delay: 0s;
      }

      :host([selectable]) #open-part {
        inset: var(--uui-size-space-3) var(--uui-size-space-4);
      }
      :host(:not([selectable])) #content {
        padding: var(--uui-size-space-3) var(--uui-size-space-4);
      }
      :host([selectable]) #content::before {
        inset: calc(var(--uui-size-space-3) * -1)
          calc(var(--uui-size-space-4) * -1);
        top: 0;
      }
    `
];
n([
  h({ type: String })
], r.prototype, "name", 2);
n([
  h({ type: String })
], r.prototype, "detail", 2);
n([
  h({ type: String, attribute: "file-ext" })
], r.prototype, "fileExt", 2);
n([
  _()
], r.prototype, "hasPreview", 2);
r = n([
  z(P)
], r);
//# sourceMappingURL=wysiwg-card-image.element-SMTzqmtn.js.map

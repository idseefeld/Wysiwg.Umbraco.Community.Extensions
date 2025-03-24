
import { html, customElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UUIRefNodeElement } from '@umbraco-cms/backoffice/external/uui';

const customElementName = 'wysiwg-ref-grid-block';
@customElement(customElementName)
export class WysiwgRefGridBlockElement extends UUIRefNodeElement {

	override render() {
		return html`
			${super.render()}
			<!-- <div class="break"></div> -->
			<slot name="areas"></slot>
		`;
	}

	static override styles = [
		...UUIRefNodeElement.styles,
		css`
			:host {
				min-width: 20px; /* Set to something, to overwrite UUI min width. */
				height: 100%; /* Help to fill out the whole layout entry. */
				min-height: var(--uui-size-16);
				flex-flow: row wrap;
				background-color: var(--uui-color-surface);
			}

			.break {
				flex-basis: 100%;
				height: 0;
			}

			#open-part {
				display: flex;
				min-height: var(--uui-size-16);
				padding: calc(var(--uui-size-2) + 1px);
                position: absolute;
                z-index: 1000;
                top: calc(var(--uui-size-16) * -1);
                left: 50%;
                width: 50%;
                background-color: #ddd;
                opacity: 0.2;
			}
            #open-part:hover {
                opacity: 1;
			}

            #actions-container,
            #tag-container{
                margin: 0;
            /* }
            #actions-container{ */
                /* position: absolute;
                z-index: 1000;
                min-height: var(--uui-size-16);
                top: calc(var(--uui-size-16) * -1); */
                background-color: #ddd;
            }

			:host([unpublished]) #open-part {
				opacity: 0.6;
			}
		`,
	];
}

export default WysiwgRefGridBlockElement;

declare global {
    interface HTMLElementTagNameMap {
        [customElementName]: WysiwgRefGridBlockElement;
    }
}

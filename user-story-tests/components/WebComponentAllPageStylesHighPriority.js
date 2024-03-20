export class WebComponentAllPageStylesHighPriority extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
<style>
@layer buttons, inherit;
    @layer buttons {
        button {
            border: thick solid black;
        }
    }
</style>
<button>Button in web-component-all-page-styles-low-priority</button>
    `;
  }
}

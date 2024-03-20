export class WebComponentAllPageStylesLowPriority extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
<style>
@layer inherit, buttons;
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

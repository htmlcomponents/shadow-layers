export class WebComponentRejectsUserStyles extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <button>Web Component Rejects User Styles</button>
    `;
  }
}

export class WebComponentFromAnotherEntity extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const button = document.createElement("button");
    button.textContent =
      "Web Component From Another Entity (thick dashed red) (from inherit.resets)";
    this.shadowRoot.appendChild(button);
  }
}

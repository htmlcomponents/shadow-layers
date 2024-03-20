export class WebComponentFromAnotherEntity extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const button = document.createElement("button");
    button.textContent = "Web Component From Another Entity";
    this.shadowRoot.appendChild(button);
  }
}

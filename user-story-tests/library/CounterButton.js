import ShadowLayers from "../../ShadowLayers.js";

export class CounterButton extends HTMLElement {
  constructor() {
    super();
    this.counter = 0;
    this.counterButtonText = "Counter Button: ";
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });

    const style = `
<style>
    @layer inherit.library-user.as.library-user, inherit.library.as.library, inherit.library-user-priority.as.library-user-priority, library-user, library, inherit, library-user-priority;
</style>
`;
    const shadowWithStyle = `
  ${style}
  <button>${this.counterButtonText}${this.counter}</button>
    `;

    this.shadow.innerHTML = shadowWithStyle;

    const inheritResult = ShadowLayers.inheritFromShadowStatementRule(
      document.querySelector("counter-button")
    );

    this.initCounterlButton();
  }

  initCounterlButton() {
    this.counterButton = this.shadow.querySelector("button");

    if (!this.counterButton) {
      return;
    }

    this.counterButton.addEventListener("click", (event) => {
      this.handleCounterButtonClick(event);
    });
  }

  handleCounterButtonClick(event) {
    this.counter++;
    this.counterButton.textContent = `${this.counterButtonText}${this.counter}`;
  }
}

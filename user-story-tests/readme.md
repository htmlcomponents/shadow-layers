# User Story Tests

Here are user stories and corresponding Web Platform Tests for the [collection of user stories #1052](https://github.com/WICG/webcomponents/issues/1052) for ["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909).

<details>
<summary>01 Page resets</summary>

As a web page author I just want my page resets to work in my shadow tree so that buttons in the shadow tree match buttons outside the shadow tree.

```html
<body>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets;
      </style>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>02 Nested shadow trees</summary>

As a web page author or shadow tree designer, I want to use declarative shadow DOM to design a `<header-container>` for my page so that buttons in `nav-bar` get their style from `<nav-bar>`, and the Home button gets its style from the page styles. No Javascript, no Flash of Unstyled Content, no attachShadow() or CustomElements.define().

```html
<body>
  <style>
    @layer buttons {
      button {
        border: thick solid blue;
      }
    }
  </style>
  <header-container>
    <template shadowrootmode="open">
      <style>
        @layer inherit.buttons;
      </style>
      <button>Home</button>
      <nav-bar>
        <template shadowrootmode="open">
          <style>
            @layer buttons {
              button {
                border: thick dashed red;
              }
            }
          </style>
          <button>About</button>
        </template>
      </nav-bar>
    </template>
  </header-container>
</body>
```

</details>

<details>
<summary>03 Web component from another entity</summary>

As a web page author I want to pass some page styles into a web component from another entity whose internal styles I do not control, so that the web component will use those styles.

```html
<body>
  <script type="module">
    import { WebComponentFromAnotherEntity } from "./components/WebComponentFromAnotherEntity.js";
    customElements.define(
      "web-component-from-another-entity",
      WebComponentFromAnotherEntity
    );
  </script>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <web-component-from-another-entity>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets;
      </style>
    </template>
  </web-component-from-another-entity>
</body>
```

</details>

<details>
<summary>04 Web component rejects user styles</summary>

As a web component author I want to reject any page styles that the web component user offers me to use, so that the styles in the web component are never affected by outer styles.

```html
<body>
  <script type="module">
    import { WebComponentRejectsUserStyles } from "./components/WebComponentRejectsUserStyles.js";
    customElements.define(
      "web-component-rejects-user-styles",
      WebComponentRejectsUserStyles
    );
  </script>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <web-component-rejects-user-styles>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets;
      </style>
    </template>
  </web-component-rejects-user-styles>
</body>
```

</details>

<details>
<summary>05 Page styles at low priority</summary>

As a shadow tree designer I want the user of the shadow tree to be able to bring in their page styles at a low priority, so that default styles in the shadow tree will win over brought-in page styles.

```html
<body>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets buttons;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>06 Page styles at high priority</summary>

As a shadow tree designer I want the user of the shadow tree to be able to bring in their page styles at a high priority, so that brought-in page styles will win over default styles in the shadow tree.

```html
<body>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer buttons, inherit.resets;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>07 All page styles at low priority</summary>

As a shadow tree designer I want the user of the shadow tree to be able to bring in all their page styles at a low priority, so that default styles in the shadow tree will win over brought-in page styles.

```html
<body>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit, buttons;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>08 All page styles at high priority</summary>

As a shadow tree designer I want the user of the shadow tree to be able to bring in all their page styles at a high priority, so that brought-in page styles will win over default styles in the shadow tree.

```html
<body>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer buttons, inherit;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>09 Web component all page styles low priority</summary>

As a web component author I want to bring in all page styles at a low priority without the web component user doing anything, so that default web component styles will win over brought-in page styles.

```html
<body>
  <script type="module">
    import { WebComponentAllPageStylesLowPriority } from "./components/WebComponentAllPageStylesLowPriority.js";
    customElements.define(
      "web-component-all-page-styles-low-priority",
      WebComponentAllPageStylesLowPriority
    );
  </script>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <web-component-all-page-styles-low-priority>
  </web-component-all-page-styles-low-priority>
</body>
```

</details>

<details>
<summary>10 Web component all page styles high priority</summary>

As a web component author I want to bring in all page styles at a high priority without the web component user doing anything, so that brought-in page styles will win over default web component styles.

```html
<body>
  <script type="module">
    import { WebComponentAllPageStylesHighPriority } from "./components/WebComponentAllPageStylesHighPriority.js";
    customElements.define(
      "web-component-all-page-styles-high-priority",
      WebComponentAllPageStylesHighPriority
    );
  </script>
  <style>
    @layer resets {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <web-component-all-page-styles-high-priority>
  </web-component-all-page-styles-high-priority>
</body>
```

</details>

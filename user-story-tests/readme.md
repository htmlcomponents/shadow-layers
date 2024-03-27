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

<details>
<summary>11 Designer or author provided template</summary>

As a shadow tree designer or web component author, I want to provide users a default template of CSS and/or HTML so that users can knowledgeably bring in page styles.

```html
<body>
  <style>
    @layer shadowbuttons {
      :host(button-group) button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer buttons, inherit.shadowbuttons;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>Button inside a shadow tree</button>
      <button>Button inside a shadow tree</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>12 Revert to parent shadow tree</summary>

As a shadow tree user, I want to bring in styles from a parent shadow tree so that shadow trees that are children of shadow trees will have styles consistent with the parent shadow trees.

(currently unimplemented in shadow layers proposal)

CSS:

```css
@layer buttons, revert.parentshadowbuttons;
```

Example:

```html
<body>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
        <style>
            @layer parentshadowbuttons {
                :host(button-group) button {
                    border: thick dashed red;
                }
            }
        </style>
        <button-item>
            <template shadowrootmode="open">
                <style>
                    @layer buttons, revert.parentshadowbuttons;
                    @layer buttons {
                        button {
                            border: thick solid black; }
                    }
                </style>
                <button>button-item inside button-group<button-item>
            </template>
        </button-item>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>13 Polyfillable</summary>

As a web author, shadow tree designer or user, or web component author or user I want any solution for bringing in page styles to shadow trees to be polyfillable, so that I can evaluate, test, adopt and deploy it in a timely matter. This seems particularly important for an HTML-parser level feature.

See the user-story-tests folder in the shadow layers proposal [repository](https://github.com/htmlcomponents/shadow-layers).

</details>

<details>
<summary>14 Inherit resets layer as higher priority renamed layer</summary>

As a web page author I want to bring in my resets layer as a renamed layer so that it can have higher priority than the shadow tree's own reset layer.

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
        @layer resets, inherit.resets.as.shadowresets, shadowresets;

        @layer resets {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from outer resets layer)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>15 Inherit resets layer as lower priority renamed layer</summary>

As a web page author I want to bring in my resets layer as a renamed layer so that it can have lower priority than the shadow tree's own reset layer.

CSS:

```css
@layer inherit.resets.as.shadowresets, shadowresets, resets;
```

Example:

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
        @layer inherit.resets.as.shadowresets, shadowresets, resets;

        @layer resets {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (from shadow tree
        resets)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>16 Interweave priorities of outer and inner context layers</summary>

As a web page author I want to interweave priorities of outer and inner context layers so some have lower priority of a shadow tree layer and some have higher priority of a shadow tree layer.

CSS:

```css
@layer inherit.A.as.outerA, inherit.B.as.outerB, outerA, A, B, outerB;
```

Example:

```html
<body>
  <style>
    @layer A {
      button.a {
        border: thick dashed red;
      }
    }
    @layer B {
      button.b {
        border: thick solid blue;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.A.as.outerA, inherit.B.as.outerB, outerA, A, B, outerB;

        @layer A {
          button.a {
            border: thin dashed red;
          }
        }
        @layer B {
          button.b {
            border: thin solid blue;
          }
        }
      </style>
      <button class="a">Button a (inner has priority, thin dashed red)</button>
      <button class="b">Button b (outer has priority, thick solid blue)</button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>17 Inherit @scope page style</summary>

As a declarative shadow tree or web component user, I want to bring into a shadow tree a page style that includes an @scope rule in a layer, so that I can give the outer context @scope rule priority over an inner content @scope rule.

```html
<body>
  <style>
    @layer card-container {
      @scope (section) to (article) {
        header {
          border: thick dashed red;
        }
      }
    }
  </style>
  <card-container>
    <template shadowrootmode="open">
      <style>
        @layer inherit.card-container.as.outer-card-container, card-container, outer-card-container;

        @layer card-container {
          @scope (section) to (article) {
            header {
              border: thick solid black;
            }
          }
        }
      </style>
      <section>
        <header>
          Card Header (thick red dashed) (from outer-card-container)
        </header>
        <article class="content">
          <header>Content Header</header>
          <div>Content</div>
        </article>
      </section>
    </template>
  </card-container>
</body>
```

</details>

<details>
<summary>18 Inherit named @sheet as layer</summary>

As a declarative shadow tree or web component user, I want to bring into a shadow tree a page style that includes an @sheet in a layer, so that I can give the outer context @sheet priority over an inner content styles.

[At-rule support detection in @supports](https://www.bram.us/2022/01/20/detect-at-rule-support-with-the-at-rule-function/) is not available, so @sheet would not be polyfillable [Multiple stylesheets per file #5629](https://github.com/w3c/csswg-drafts/issues/5629), so the POC does not implement @sheet. However, @layer is widely deployed so polyfillability is not needed for it, and @layer also provides the essential priority mechanism.

Nonetheless, an @sheet supporting syntax would be possible:

```css
//Inherit named sheet as layer
@layer inherit.sheet.mysheet.as.mysheet, mysheet;
```

</details>

<details>
<summary>19 Inherit unlayered page styles as lower priority layer</summary>

As a user or author of a declarative shadow tree or web component I want to bring in unlayered page styles into a shadow tree so that the outer context unlayered page styles will have lower priority than the shadow tree styles.

In CSS:

```css
@layer inherit.unlayered.as.unlayered, unlayered, shadowstyles;
```

Example:

```html
<body>
  <style>
    button {
      border: thick solid black;
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.unlayered.as.unlayered, unlayered, shadowstyles;

        @layer shadowstyles {
          button {
            border: thick dashed red;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (styled from
        shadowstyles)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>20 Inherit unlayered page styles as higher priority layer</summary>

As a user or author of a declarative shadow tree or web component I want to bring in unlayered page styles into a shadow tree so that the outer context unlayered page styles will have higher priority than the shadow tree styles.

In CSS:

```css
@layer inherit.unlayered.as.unlayered, unlayered, shadowstyles;
```

Example:

```html
<body>
  <style>
    button {
      border: thick solid black;
    }

    @layer buttons {
      button {
        border: thick dashed yellow;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.unlayered.as.unlayered, shadowstyles, unlayered;

        @layer shadowstyles {
          button {
            border: thick dashed red;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (styled from unlayered
        page styles)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>21 Interweave priorities of outer layered and unlayered styles</summary>

As a user or author of a declarative shadow tree or web component I want to bring in both layered unlayered page styles into a shadow tree, so that the outer context layered and unlayered page styles can interweave with the shadow tree styles.

In CSS:

```css
@layer inherit.layered.as.layered, inherit.unlayered.as.unlayered, layered, shadowstyles, unlayered;
```

Example:

```html
<body>
  <style>
    button {
      border: thick solid black;
    }

    @layer buttons {
      button {
        border: thick dashed yellow;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.layered.as.layered, inherit.unlayered.as.unlayered, layered, shadowstyles, unlayered;
        @layer shadowstyles {
          button {
            border: thick dashed red;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (styled from unlayered
        page styles)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>22 Inherit all outer page styles</summary>

As a user or author of a declarative shadow tree or web component I want to bring in both layered unlayered page styles into a shadow tree, so that the outer context unlayered styles have priority over outer context layered styles.

In CSS:

```css
@layer inherit.unlayered.as.unlayered, inherit.unlayered.as.unlayered, layered, unlayered;
```

Example:

```html
<body>
  <style>
    button {
      border: thick solid black;
    }

    @layer buttons {
      button {
        border: thick dashed yellow;
      }

      @import url(assets/resets.css) layer(resets);
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.layered.as.layered, inherit.unlayered.as.unlayered, layered, unlayered;
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (styled from unlayered
        page styles)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>23 Pass through from design system</summary>

As a user of a design system and a web component or declarative shadow tree, neither of which I control the styles, I want to pass CSS framework styles into the web component or declarative shadow tree, so that the web component or declarative shadow tree can be styled consistent with the CSS framework.

Example:

```html
<body>
  <style>
    button {
      border: thick solid black;
    }

    @layer design-system {
      button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.design-system.as.design-system, design-system;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (styled from design
        system layer)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>24 Pass through from layered CSS framework</summary>

As a user of a layer-aware [low-priority CSS framework](https://github.com/w3c/csswg-drafts/issues/6284#issuecomment-1006946621) and a web component or declarative shadow tree, neither of which I control the styles, I want to pass CSS framework styles into the web component or declarative shadow tree, so that the web component or declarative shadow tree can be styled consistent with the CSS framework.

Example:

```html
<body>
  <style>
    @layer css-framework {
      button {
        border: thick dashed red;
      }
    }
    button {
      border: thick solid black;
    }
  </style>
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.css-framework.as.css-framework, css-framework;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (styled from
        css-framework)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>25 Inherit @imported CSS file</summary>

As a shadow tree or web component user, I want to inherit into a shadow tree a CSS file that I have already @imported into the page outside the shadow tree, so that I don't have to @import the same CSS file twice (once into the page, and again into the shadow tree).

In other words, I don't want to have to do this:

resets.css file:

```css
button {
  border: thick dashed red;
}
```

Double @import I don't want to do:

```html
<body>
  @import assets/resets.css;
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      @import assets/resets.css;
      <button>
        Button inside a shadow tree (thick dashed red) (double imported
        resets.css)
      </button>
    </template>
  </button-group>
</body>
```

See also [Allow authors to apply new css features (like cascade layers) while linking stylesheets #7540](https://github.com/whatwg/html/issues/7540) and [Provide an attribute for assigning a `<link>` to a cascade layer #5853](https://github.com/w3c/csswg-drafts/issues/5853).

Example:

```html
<body>
  @import assets/resets.css layer(resets);
  <button>Button outside a shadow tree</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets.as.outerresets, outerresets;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from inherited
        resets.css file)
      </button>
    </template>
  </button-group>
</body>
```

</details>

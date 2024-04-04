# User Story Tests

Here are user stories and corresponding web platform [tests](https://github.com/htmlcomponents/shadow-layers/tree/main/user-story-tests) for the [collection of user stories #1052](https://github.com/WICG/webcomponents/issues/1052) for ["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909).

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
  <button>Button outside a shadow tree (thick dashed red)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from inherit.resets)
      </button>
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
      <button>Home (thick solid blue) (from inherit.buttons)</button>
      <nav-bar>
        <template shadowrootmode="open">
          <style>
            @layer buttons {
              button {
                border: thick dashed red;
              }
            }
          </style>
          <button>About (thick dashed red) (from shadow layer buttons)</button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets, buttons;

        @layer buttons {
          button {
            border: thick solid black;
          }
        }
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (from shadow buttons
        layer)
      </button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
      <button>
        Button inside a shadow tree (thick dashed red) (from inherit.resets)
      </button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
      <button>
        Button inside a shadow tree (thick solid black) (from shadow layer
        buttons)
      </button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
      <button>
        Button inside a shadow tree (thick dashed red) (from inherit)
      </button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
  <button>Button outside a shadow tree (unstyled)</button>
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
      <button>
        Button inside a shadow tree (thick dashed red) (from
        inherit.shadowbuttons)
      </button>
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
        Button inside a shadow tree (thick dashed red) (from
        inherit.resets.as.shadowresets)
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
  <button>Button outside a shadow tree (thick dashed red)</button>
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
        Button inside a shadow tree (thick solid black) (from shadow tree resets
        layer)
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
  <button>Button outside a shadow tree (unstyled)</button>
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
      <button class="a">
        Button a (thin dashed red) (inner A layer has priority)
      </button>
      <button class="b">
        Button b (thick solid blue) (outer B layer has priority)
      </button>
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
@layer inherit.@sheet.mysheet.as.mysheet, mysheet;
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
  <button>Button outside a shadow tree (thick solid black)</button>
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
        Button inside a shadow tree (thick dashed red) (from shadow layer
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
  <button>Button outside a shadow tree (thick solid black)</button>
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
        Button inside a shadow tree (thick solid black) (from
        inherit.unlayered.as.unlayered)
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
  <button>Button outside a shadow tree (thick solid black)</button>
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
        Button inside a shadow tree (thick solid black) (from
        inherit.unlayered.as.unlayered)
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
    }

    @import url(assets/resets.css) layer(resets);
  </style>
  <button>Button outside a shadow tree (thick solid black)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.layered.as.layered, inherit.unlayered.as.unlayered, layered, unlayered;
      </style>
      <button>
        Button inside a shadow tree (thick solid black) (from
        inherit.unlayered.as.unlayered)
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
  <button>Button outside a shadow tree (thick solid black)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.design-system.as.design-system, design-system;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from
        inherit.design-system.as.design-system)
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
  <button>Button outside a shadow tree (thick solid black)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.css-framework.as.css-framework, css-framework;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from
        inherit.css-framework.as.css-framework)
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
  <style>
    @import url(assets/resets.css) layer(resets);
  </style>
  <button>Button outside a shadow tree (thick dashed red)</button>
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

<details>
<summary>26 Page styles only affecting shadow tree</summary>
<p>
As a shadow tree or web component user, I want to provide some page styles outside a shadow tree that won't affect the page at all but can be inherited into the shadow tree, so that I can write page styles that only affect shadow trees.
</p>

- Note that [when evaluated in the context of a shadow tree](https://drafts.csswg.org/css-scoping/#host-selector), `:host( <compound-selector> )` matches the shadow tree’s shadow host if the shadow host, in its normal context, matches the selector argument. In any other context, it matches nothing.
- `:host` behaves similarly in any other context.

```html
<body>
  <style>
    @layer button-group-styles {
      :host(button-group) button {
        border: thick dashed red;
      }
    }
  </style>
  <button>Button outside a shadow tree (unstyled)</button>
  <button-group>
    <template shadowrootmode="open">
      <style>
        @layer inherit.button-group-styles.as.page-defined-styles, page-defined-styles;
      </style>
      <button>
        Button inside a shadow tree (thick dashed red) (from
        inherit.button-group-styles.as.page-defined-styles)
      </button>
    </template>
  </button-group>
</body>
```

</details>

<details>
<summary>27 Markdown component with automatic page styles</summary>

As a web component author, I want to write a web component that transforms markdown into HTML and brings in page styles, so that transformed markdown is styled from page styles without the web component user having to do anything.

A [prototypical](https://github.com/WICG/webcomponents/issues/909#issuecomment-1936910846) `<md-block>` web component with page styles.

```html
<body>
  <script type="module">
    import { MDBlock } from "./components/MDBlock.js";
    customElements.define("md-block", MDBlock);
  </script>

  <style>
    h2 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree (thick dashed red)</h2>
  <md-block>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)
    </script>
  </md-block>
</body>
```

</details>

<details>
<summary>28 Markdown component with author-defined page layer</summary>

As a web component author, I want to write a web component that transforms markdown into HTML and brings in a page layer with a name that I designate, so that the transformed markdown is styled from the named page layer I designate.

```html
<body>
  <script type="module">
    import { MDBlockWithAuthorDefinedPageLayer } from "./components/MDBlockWithAuthorDefinedPageLayer.js";
    customElements.define(
      "md-block-with-author-defined-page-layer",
      MDBlockWithAuthorDefinedPageLayer
    );
  </script>

  <style>
    @layer md-block-styles {
      h2 {
        border: thick dashed red;
      }
    }
  </style>
  <h2>H2 outside shadow tree (thick dashed red)</h2>
  <md-block-with-author-defined-page-layer>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)
    </script>
  </md-block-with-author-defined-page-layer>
</body>
```

</details>

<details>
<summary>29 Markdown component with author-defined lower priority shadow layer
</summary>

As a web component author, I want to write a web component that transforms markdown into HTML and brings in page styles, so that the transformed markdown is styled from page styles if they exist and if not the transformed markdown is styled by default web component provided styles, without the web component user having to do anything.

```html
<body>
  <script type="module">
    import { MDBlockWithAuthorDefinedLowerPriorityShadowLayer } from "./components/MDBlockWithAuthorDefinedLowerPriorityShadowLayer.js";
    customElements.define(
      "md-block-with-author-defined-lower-priority-shadow-layer",
      MDBlockWithAuthorDefinedLowerPriorityShadowLayer
    );
  </script>

  <style>
    h2 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree (thick dashed red)</h2>
  <md-block-with-author-defined-lower-priority-shadow-layer>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)

      ### H3 from markdown (thick solid black) (from web component default styles)
    </script>
  </md-block-with-author-defined-lower-priority-shadow-layer>
</body>
```

</details>

<details>
<summary>30 Markdown component with author-defined higher priority shadow layer</summary>

As a web component author, I want to write a web component that transforms markdown into HTML and brings in page styles, so that the transformed markdown is styled from page styles, but if web component default styles exist they have higher priority, without the web component user having to do anything.

```html
<body>
  <script type="module">
    import { MDBlockWithAuthorDefinedHigherPriorityShadowLayer } from "./components/MDBlockWithAuthorDefinedHigherPriorityShadowLayer.js";
    customElements.define(
      "md-block-with-author-defined-higher-priority-shadow-layer",
      MDBlockWithAuthorDefinedHigherPriorityShadowLayer
    );
  </script>

  <style>
    h2,
    h3 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree (thick dashed red)</h2>
  <md-block-with-author-defined-higher-priority-shadow-layer>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)

      ### H3 from markdown (thick solid black) (from web component default styles)
    </script>
  </md-block-with-author-defined-higher-priority-shadow-layer>
</body>
```

</details>

<details>
<summary>31 Markdown component with user-selectable page styles</summary>

As a web component author, I want to write a web component that transforms markdown into HTML, and has default markdown styles and user-selectable page styles, so that the transformed markdown is styled by either the defaults or by the styled user-selectable page styles, as the user sees fit.

```html
<body>
  <script type="module">
    import { MDBlockWithUserSelectablePageStyles } from "./components/MDBlockWithUserSelectablePageStyles.js";
    customElements.define(
      "md-block-with-user-selectable-page-styles",
      MDBlockWithUserSelectablePageStyles
    );
  </script>

  <style>
    @layer resets {
      h2 {
        border: thick dashed red;
      }
    }
  </style>
  <h2>H2 outside shadow tree (thick dashed red)</h2>
  <md-block-with-user-selectable-page-styles>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)

      ### H3 from markdown (thick solid black) (from component defaults)
    </script>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets.as.outerresets, md-block-default-styles, outerresets;
      </style>
    </template>
  </md-block-with-user-selectable-page-styles>
</body>
```

</details>

<details>
<summary>32 Markdown component with page @scope</summary>

As a web component author, I want to write a web component that transforms markdown into HTML, and has default markdown styles and user-selectable page styles, so that the transformed markdown can be styled by a user-provided @scope page style.

```html
<body>
  <script type="module">
    import { MDBlockWithUserSelectablePageStyles } from "./components/MDBlockWithUserSelectablePageStyles.js";
    customElements.define(
      "md-block-with-user-selectable-page-styles",
      MDBlockWithUserSelectablePageStyles
    );
  </script>

  <style>
    @layer markdown-scope-styles {
      @scope (article) to (li) {
        ul {
          border: thick dashed red;
        }
      }
    }
  </style>
  <h2>H2 outside shadow tree (unstyled)</h2>
  <md-block-with-user-selectable-page-styles>
    <script type="text/markdown">
      ## H2 from markdown (unstyled)

      - list item from markdown (thick dashed red) (from page @scope)

      ### H3 from markdown (thick solid black) (from component defaults)
    </script>
    <template shadowrootmode="open">
      <style>
        @layer inherit.markdown-scope-styles.as.markdown-scope-styles, md-block-default-styles, markdown-scope-styles;
      </style>
    </template>
  </md-block-with-user-selectable-page-styles>
</body>
```

</details>

<details>
<summary>33 Component library with CSS file and page styles</summary>

As a shadow-tree-based component library author or maintainer I want to provide a single, once-imported CSS file for all the components in the library and also bring all page styles into some of the components, so that library and page styles only apply to some or all components as appropriate.

Exemplar imperative components:

- **`<md-block>`**: An imperative (Javascript) component that transforms and displays markdown contained in a `<script type="text/markdown">` element. (a [prototypical](https://github.com/WICG/webcomponents/issues/909#issuecomment-1936910846) imperative shadow tree component with page styles added, see 27-32 Markdown Component user stories)
- **`<counter-button>`**: An imperative (Javascript) shadow tree component with a clickable counter button. (like a [prototypical plain DOM Javascript component](https://vitejs.dev/guide/))

See user story "25 Inherit imported css file".

```html
<body>
    <script type="module">
        import { MDBlock } from "./library/MDBlock.js";
        import { CounterButton } from "./library/CounterButton.js";
        customElements.define(
            "md-block",
            MDBlock
        );
        customElements.define(
            "counter-button",
            CounterButton
        );
    </script>

    <style>
        @import url(library/library.css) layer(library);

        h2 {
            border: thick dashed red;
        }

        button {
            border: thick ridge yellow;
        }

        section {
            border: thick solid black;
        }
    </style>
    <section>
        Section outside shadow tree
        <h2>H2 outside shadow tree (thick dashed red)</h2>
        <button>button outside shadow tree (thick ridge yellow)</h2>
    </section>
    <md-block>
        <script type="text/markdown">
## H2 from markdown (thick dashed red) (from page styles)
    </script>
    </md-block>
    <counter-button></counter-button>
</body>
```

</details>

<details>
<summary>34 Component library with declarative and imperative components and page styles</summary>

As a shadow-tree-based component library author or maintainer starting from the component library in "33 Component library with CSS file and page styles", I want to add declarative-only components (components built with declarative shadow DOM and no Javascript), so that the library provides both declarative and imperative components.

Exemplar declarative component:

- **`<section-container>`**: A declarative component (no Javascript declarative shadow tree) that styles semantic HTML elements section, header, and footer. (A platform-encapusulated version of a [very commonly](https://wordpress.com/support/wordpress-editor/blocks/group-block/) implemented [web design pattern](https://university.webflow.com/lesson/container?topics=elements)).

```html
<body>
    <script type="module">
        import { MDBlock } from "./library/MDBlock.js";
        import { CounterButton } from "./library/CounterButton.js";
        customElements.define(
            "md-block",
            MDBlock
        );
        customElements.define(
            "counter-button",
            CounterButton
        );
    </script>

    <style>
        @import url(library/library.css) layer(library);

        h2 {
            border: thick dashed red;
        }

        button {
            border: thick ridge yellow;
        }

        section {
            border: thick solid black;
        }
    </style>
    <section>
        Section outside shadow tree
        <h2>H2 outside shadow tree (thick dashed red)</h2>
        <button>button outside shadow tree (thick ridge yellow)</h2>
    </section>
    <section-container>
        <template shadowrootmode="open">
            <style>
                @layer inherit, inherit.library.as.library, library;
            </style>
            <section>
                <slot></slot>
            </section>
        </template>
        <div>section-container</div>
        <md-block>
            <script type="text/markdown">
## H2 from markdown (thick dashed red) (from page styles)
      </script>
        </md-block>
        <counter-button></counter-button>
    </section-container>
</body>
```

</details>

<details>
<summary>35 Component library with multi-component user-settable lower and higher priority page styles</summary>

As a shadow-tree-based component library author or maintainer starting from the component library in "34 Component library with declarative and imperative components and page styles", I want to add multi-component user-settable lower and higher priority page styles, so that users can provide page styles that have either lower or higher priority than component default styles.

```html
<body>
    <script type="module">
        import { MDBlock } from "./library/MDBlock.js";
        import { CounterButton } from "./library/CounterButton.js";
        customElements.define(
            "md-block",
            MDBlock
        );
        customElements.define(
            "counter-button",
            CounterButton
        );
    </script>

    <style>
        @import url(library/library.css) layer(library);

        h2 {
            border: thick dashed red;
        }

        button {
            border: thick ridge yellow;
        }

        section {
            border: thick solid black;
        }

        @layer library-user {
            h4 {
                border: thick ridge red;
            }
        }

        @layer library-user-priority {
            h5 {
                border: thick ridge black;
            }
        }
    </style>
    <section>
        Section outside shadow tree
        <h2>H2 outside shadow tree (thick dashed red)</h2>
        <button>button outside shadow tree (thick ridge yellow)</h2>
    </section>
    <section-container>
        <template shadowrootmode="open">
            <style>
                @layer inherit, inherit.library.as.library, library;
            </style>
            <section>
                <slot></slot>
            </section>
        </template>
        <md-block>
            <script type="text/markdown">
## H2 from markdown (thick dashed red) (from page styles)

### H3 from markdown

#### H4 from markdown (thick ridge red) (from library-user)

##### H5 from markdown (thick ridge black) (from library-user-priority)
      </script>
        </md-block>
        <counter-button></counter-button>
    </section-container>
</body>
```

</details>

<details>
<summary>36 Component library with individual component user-settable lower and higher priority page styles</summary>

As a shadow-tree-based component library author or maintainer starting from the component library in "35 Component library with multi-component user-settable lower and higher priority page styles", I want to add to individual components user-settable lower and higher priority page styles, so that users can bring in and priortize any page style layers they want.

```html
<body>
    <script type="module">
        import { MDBlock } from "./library/MDBlock.js";
        import { CounterButton } from "./library/CounterButton.js";
        customElements.define(
            "md-block",
            MDBlock
        );
        customElements.define(
            "counter-button",
            CounterButton
        );
    </script>

    <style>
        @import url(library/library.css) layer(library);

        @layer page-layer {
            h2 {
                border: thick dashed red;
            }

            button {
                border: thick ridge yellow;
            }

            section {
                border: thick solid black;
            }
        }
    </style>
    <section>
        Section outside shadow tree
        <h2>H2 outside shadow tree (thick dashed red)</h2>
        <button>button outside shadow tree (thick ridged yellow)</h2>
    </section>
    <section-container>
        <template shadowrootmode="open">
            <style>
                @layer inherit.page-layer.as.page-layer, inherit.library.as.library, library;
            </style>
            <section>
                <slot></slot>
            </section>
        </template>
        <md-block>
            <script type="text/markdown">
## H2 from markdown (thick dashed red) (from page layer)

###### H6 from markdown (thick solid black) (from component defaults)
      </script>
        </md-block>
        <counter-button></counter-button>
    </section-container>
</body>
```

</details>

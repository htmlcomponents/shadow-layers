# Add an adoptStyles capability in shadowRoots (WICG #909: open-stylable Shadow Roots) <!-- omit from toc -->

**Table of Contents**

- [Background](#background)
  - [Bringing Page Styles into Shadow Trees](#bringing-page-styles-into-shadow-trees)
  - [New Tools, New Solutions](#new-tools-new-solutions)
  - [Declarative Shadow DOM](#declarative-shadow-dom)
  - [Cascade Layers](#cascade-layers)
- [Proposal](#proposal)
  - [DOM Interface ShadowRoot](#dom-interface-shadowroot)
  - [CSS Cascading and Inheritance Context](#css-cascading-and-inheritance-context)
  - [Declarative Parse Locations](#declarative-parse-locations)
- [Rationale](#rationale)
- [Web Platform Tests \& User Stories](#web-platform-tests--user-stories)
- [Potential Extensions](#potential-extensions)
- [Polyfill](#polyfill)
- [Conclusion \& Proposed CSS Working Group Resolution](#conclusion--proposed-css-working-group-resolution)

This "[Shadow Layers](https://github.com/htmlcomponents/shadow-layers)" proposal, web platform tests, and polyfill address ["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) (2020) with a proposed way for document-level CSS ("page styles") from the outer context of a shadow tree to be referenced and prioritized (in other words "adopted") from inside the inner context of the shadow tree.

The proposal leverages two new platform features now available in all modern browsers:

- [declarative shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) (2024)
- [cascade layers](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers) (2022)

"Page styles" are document-level CSS rules in the outer context outside a shadow tree in a grouping like a cascade layer or other grouping.

The proposal includes an instance method `shadowRoot.adoptStyles()` that sets and/or returns a styleReferenceList as well as a declarative parse location in an @layer statement rule inside a shadow tree:

```css
@layer inherit.resets;
```

Or in an attribute on a declaratively created shadow tree:

```html
<custom-element adoptstyles="inherit.resets">
    <template shadowrootmode="open">
        ...
    </tempate>
</custom-element>
```

## Background

### Bringing Page Styles into Shadow Trees

["Open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) was opened in 2020 for the primary use case of component library authors or maintainers who want to move to web components while supporting stylesheets that they don't control. It was perceived that "strong style encapsulation is a major hinderance - perhaps the primary obstacle - to using shadow DOM".

The original issue posited a new mode for shadow trees imperatively attached to custom elements: `this.attachShadow({mode: 'open-stylable'})` "that allows selectors to reach into a shadow root from above".

Over 250 ensuing comments discussed topics like:

- the advisability and feasibility of [subsetting](https://github.com/WICG/webcomponents/issues/986#issuecomment-1936916230) or [filtering](https://github.com/WICG/webcomponents/issues/909#issuecomment-2000272076) the brought-in styles
- "push" approaches that would inject styles into custom elements or shadow trees from outside on the page
- "shadow crossing combinators" that would reach across shadow boundaries
- the need for existing imperatively-created web components to continue to work as expected without component users [too easily changing shadow tree styling](https://github.com/WICG/webcomponents/issues/1053#issuecomment-2007665823) in unexpected or unmanageable ways
- the role of [component authors vs. component users](https://github.com/WICG/webcomponents/issues/909#issuecomment-1951970599)
- the risk of [conflating rather than combining](https://github.com/WICG/webcomponents/issues/909#issuecomment-2011014948) multiple features, like [access vs priority](https://github.com/w3c/csswg-drafts/issues/9792#issuecomment-1890787533), @layer priorities, [@scope](https://github.com/WICG/webcomponents/issues/909#issuecomment-1995046971) and @sheet
- a [Collection of user stories #1052](https://github.com/WICG/webcomponents/issues/1052)
- and other related topics

It is of note that all modern browsers already support CSS rules in declaratively or imperatively created shadow trees that are already inside a shadow tree either through CSS files in a link or import tag or through user-written CSS rules inside the shadow tree.

### New Tools, New Solutions

Since 2020, new standardized features have become available in all modern browsers, opening up new potential approaches to solve this longstanding issue:

- cascade layers (2022)
- declarative shadow DOM (2024)

### Declarative Shadow DOM

[Declarative shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) solves a fundamental Web platform issue, the declarative subtree problem in markup languages that predates even HTML itself. Until recently, the only way to create a shadow tree was in Javascript.

But that is behind. Now, anyone using or authoring a web component (or designing or using a stand-alone shadow tree) can use declarative shadow DOM.

There are two obvious consequences of the modern availability of declarative shadow trees as to issue #909:

- An imperative-only solution like `this.attachShadow({mode: 'open-stylable'})` is incomplete, because a declarative form is also needed.
- Declarative shadow trees present a unique polyfillability challenge because the `<template shadowrootmode="open">` used to create a declarative shadow tree is removed at HTML parse time before Javascript can run, and the template element never appears in the DOM. Polyfillability is always a preferability factor in specifying new Web platform capabilites, and even more so at such a basic, rarely-changing low level as HTML parsing.

But also and more fundamentally for #909, declarative shadow DOM provides a new safe path for users to present styles to web components:

- Shadow trees are "just HTML" (a document fragment attached to a particular element, for which certain CSS capabilities apply).
- Shadow trees are not "Custom Elements" i.e elements upgraded by `customElements.define()` to have a Javascript class instance associated with them. This kind of "Custom Element" is often informally called a "web component" or a "Web Component".
- A web component can now use declarative shadow DOM in addition to `this.attachShadow()` to obtain a shadow tree.
- "Custom Elements" themselves don't encapsulate anything. Shadow trees do the encapsulating (preventing page CSS rules from entering or exiting the shadow tree while still allowing inheritance).

[Said differently](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom): "Declarative Shadow DOM can be used on its own as a way to encapsulate styles or customize child placement, but it's most powerful when used with Custom Elements".

So declarative shadow DOM already gives web component users a way to present a shadow tree (with user-written CSS styles and CSS files in link and import tags in it) to the web component. And a way for the web component to accept, reject (the default), or use those styles as it sees fit.

Thus, declarative shadow DOM already answers the often-expressed need on behalf of web component authors to have opt-in say before accepting user styles into web components.

So the Shadow Layers proposal uses declarative shadow trees to "pull" in page styles. Any page style accessing syntax would therefore of necessity be declarative and work from "inside", not "outside", the shadow tree.

### Cascade Layers

CSS [cascade layers](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers) (@layer) provide a cascade-level mechanism for author origin grouping and prioritizing of CSS rules.

Cascade layers already work inside shadow trees (but do not now reference page styles outside the shadow tree).

Also, cascade layers have particular characteristics desirable for bringing in page styles into shadow trees:

- Cascade layers provide named groupings of CSS rules that could be referenced from inside a shadow tree.
- There is a short list of CSS-wide keywords (in cascade level 5) conveniently available as [reserved-for-future-use](https://drafts.csswg.org/css-cascade-5/#layer-names) layer names, including "inherit" and "revert". (See also [browsers do not disallow CSS-wide keywords in layer names #10067](https://github.com/w3c/csswg-drafts/issues/10067))
- Cascade layers provide a mechanism to import a CSS file once as a [named layer of page styles](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) (`@import url layer(layer-name)`) that could be referenced in multiple shadow trees.
- Cascade layers provide prioritization (and in shadow trees the potential for reprioritizing and renaming). Although styles not in a layer, or "unlayered styles", cascade together into a final implicit "highest priority" label, it would be possible to reference layered or unlayered page styles as their own layers from inside a shadow tree [without requiring modification to @layer itself](https://github.com/w3c/csswg-drafts/issues/6323), thus providing shadow tree reprioritization of page styles that is needed for several user stories.

## Proposal

- **`shadowRoot.adoptStyles()`**: An instance method of the [shadow root interface](https://dom.spec.whatwg.org/#interface-shadowroot) (see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)), that sets and/or returns a styleReferenceList associated with a shadowRoot.
- **`styleReferenceList`**: A [sequence<DOMString>](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#the-domstringlist-interface) (an array of strings) of references to a shadow tree's outer context style groupings.
- **Declarative parse locations** from which a `styleReferenceList` could be DOM parsed: from particular attributes and from CSSLayerStatementRules in a shadow tree inner context.

### DOM Interface ShadowRoot

<b>_Add to [DOM § 4.8 Interface ShadowRoot](https://dom.spec.whatwg.org/#interface-shadowroot)_</b>:

Shadow roots have an associated **method adoptStyles()** that sets and returns a styleReferenceList [sequence<DOMString>](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#the-domstringlist-interface) of references to a shadow tree's outer context style groupings, in the following allowed string formats:

- **`inherit`**: references all outer context page styles

- **`inherit.<layerName>`**: references an outer context page style named layer
- **`inherit.as.<renamedLayerName>`** and **`inherit.<layerName>.as.<renamedLayerName>`**, reference and rename a layer
- **`inherit.unlayered`** and **`inherit.unlayered.as.<renamedLayerName>`**: reference all outer context unlayerd page styles
- **`inherit.layered`** and **`inherit.layered.as.<renamed.LayerName>`**: reference all outer context layered page styles

- **`revert`**, **`revert.<layerName>`**, and **`revert.<layerName>.as.<renamedLayerName>`**: reference CSS rules in a parent shadow tree

All other string formats are ignored and skipped.

- **`styleReferenceList shadowRoot.adoptStyles()`** returns an array of references attached to a shadowRoot.

- **`styleReferenceList shadowRoot.adoptStyles(styleReferenceList)`** sets and returns an array of references attached to a shadowRoot.

### CSS Cascading and Inheritance Context

<b>_Add to CSS Cascading and Inheritance ([§ 6.1 Context in Level 5](https://www.w3.org/TR/css-cascade-5/#cascade-context) or [§ 2.1 Context in Level 6](https://www.w3.org/TR/css-cascade-6/#cascade-sort))_:
</b>
The styleReferenceList is populated at DOM parsing in the following sourcing order as last in [final CSS style sheets](https://drafts.csswg.org/cssom/#documentorshadowroot-final-css-style-sheets) (i.e. last in cascade [Order of Appearance](https://www.w3.org/TR/css-cascade-5/#cascade-order)):

- An `adoptStyles` attribute on a [declarative shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) template element.
- An `adoptStyles` attribute of a shadow host with its [associated declarative property](https://dom.spec.whatwg.org/#interface-shadowroot) set to true.
- Any [CSSLayerStatementRule](https://drafts.csswg.org/css-cascade-5/#the-csslayerstatementrule-interface) in the inner context of the shadow host.

### Declarative Parse Locations

This proposal recommends narrowing to only CSSLayerStatementRules of the three included declarative parse locations for styleReferenceLists to appear and be parsed.

The three included declarative parse locations:

In an @layer statement rule (CSSLayerStatementRule) inside a shadow tree:

```css
@layer inherit.resets.as.outer-resets, outer-resets;
```

On an attribute on a declaratively created shadow host element:

```html
<custom-element adoptstyles="inherit.resets">
    <template shadowrootmode="open">
        ...
    </tempate>
</custom-element>
```

On an attribute on the declaring template element of a declaratively created shadow host element:

```html
<custom-element>
    <template shadowrootmode="open" adoptstyles="inherit.resets">
        ...
    </tempate>
</custom-element>
```

For all of the above declarative parse locations, the format `inherit.<layerName>.as.<renamedLayerName>` would require that `<renamedLayerName>` also be listed in an @layer statement rule inside the shadow tree to be prioritized by the @layer statement rule.

Summarizing some tradeoffs for the 3 declarative locations:

| Location              | Polyfillable? | Imperative? | User action not required? |
| --------------------- | ------------- | ----------- | ------------------------- |
| CSSLayerStatementRule | yes           | yes         | yes                       |
| shadow host element   | yes           | no          | no                        |
| template attribute    | no            | yes         | no                        |

The column "Imperative?" means would the declarative format location be automatically parsed for imperatively created shadow trees (i.e. those created by attachShadow()) without an additional function or [necessary opt-in step](https://github.com/WICG/webcomponents/issues/909#issuecomment-1994686538).

The column "User action not required" refers to the [discussion](https://github.com/WICG/webcomponents/issues/909#issuecomment-1936910846) and [consideration](https://github.com/WICG/webcomponents/issues/909#issuecomment-1951970599) of placing complexity and opt-in on the component author rather than the component user "... component user does not need to do absolutely anything ... the complexity and all the opt-in is within the component definition, which I think is essential for solving the use cases ...".

## Rationale

The proposed instance method, the styleReferenceList format, and the declarative parse locations are influenced by several considerations:

- **the need to support both declaratively and imperatively created shadow trees**
- **the need to not "break" or create undesired behavior for existing web components or @layer usage** as already met in large part by declarative shadow DOM
- **the large range of user stories** (see below)
- **the desirability of polyfillability** as already met in part and uniquely complicated in part by declarative shadow DOM

In short, the `inherit.as.<renamedLayerName>` formats work with `shadowRoot.adoptStyles()` and also with a declarative shadow DOM, a shadow tree created with `this.attachShadow()`, cascade `@layer`, and` @scope` without breaking or requiring change to any of them, and (except if attached to a declarative shadow tree `<template>`) are polyfillable.

Also, it is assumed that any CSSLayerStatementRule in the shadow tree will be parsed (See [comment](https://github.com/w3c/csswg-drafts/issues/10094#issuecomment-2004316955) to [Proposal: @layer initial should always be the first layer #10094](https://github.com/w3c/csswg-drafts/issues/10094)).

## Web Platform Tests & User Stories

A large range of user stories have been collected, see [Collection user stories #1052](https://github.com/WICG/webcomponents/issues/1052), and the following have been implemented and tested in the polyfill as web platform tests:

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
  <style>
    @import assets/resets.css layer(resets);
  </style>
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

<details>
<summary>26 Page styles only affecting shadow tree</summary>
<p>
As a shadow tree or web component user, I want to provide some page styles outside a shadow tree that won't affect the page at all but can be inherited into the shadow tree, so that I can write page styles that only affect shadow trees.
</p>

- Note that [when evaluated in the context of a shadow tree](https://drafts.csswg.org/css-scoping/#host-selector), `:host( <compound-selector> )` matches the shadow tree’s shadow host if the shadow host, in its normal context, matches the selector argument. In any other context, it matches nothing.
- `:host` behaves similarly in any other context.

```html
<style>
  @layer button-group-styles {
    :host(button-group) button {
      border: thick dashed red;
    }
  }
</style>
<button>Button outside a shadow tree (not thick dashed red)</button>
<button-group>
  <template shadowrootmode="open">
    <style>
      @layer inherit.button-group-styles.as.page-defined-styles, page-defined-styles;
    </style>
    <button>
      Button inside a shadow tree (thick dashed red) (from page layer
      'button-group-styles')
    </button>
  </template>
</button-group>
```

</details>

<details>
<summary>27 Markdown component with automatic page styles</summary>

As a web component author, I want to write a web component that transforms markdown into HTML and brings in page styles, so that transformed markdown is styled from page styles without the web component user having to do anything.

A [prototypical](https://github.com/WICG/webcomponents/issues/909#issuecomment-1936910846) `<md-block>` web component with page styles.

```html
<body>
  <style>
    h2 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree</h2>
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
  <style>
    @layer md-block-styles {
      h2 {
        border: thick dashed red;
      }
    }
  </style>
  <h2>H2 outside shadow tree</h2>
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
  <style>
    h2 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree</h2>
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
  <style>
    h2,
    h3 {
      border: thick dashed red;
    }
  </style>
  <h2>H2 outside shadow tree</h2>
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
  <style>
    @layer resets {
      h2 {
        border: thick dashed red;
      }
    }
  </style>
  <h2>H2 outside shadow tree</h2>
  <md-block-with-user-selectable-page-styles>
    <script type="text/markdown">
      ## H2 from markdown (thick dashed red) (from page styles)

      ### H3 from markdown (thick solid black) (from component defaults)
    </script>
    <template shadowrootmode="open">
      <style>
        @layer inherit.resets.as.outerresets, mk-block-defaults, outerresets;
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
  <style>
    @layer markdown-scope-styles {
      @scope (article) to (li) {
        ul {
          border: thick dashed red;
        }
      }
    }
  </style>
  <h2>H2 outside shadow tree</h2>
  <md-block-with-user-selectable-page-styles>
    <script type="text/markdown">
      ## H2 from markdown

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
    <style>
        @import url(library/library.css) layer(library);

        h2 {
            border: thick dashed red;
        }

        button {
            border: thick ridge yellow;
        }

        section {
            border: thick solid red;
        }
    </style>
    <section>
        Section outside shadow tree
        <h2>H2 outside shadow tree</h2>
        <button>button outside shadow tree</h2>
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
        <h2>H2 outside shadow tree</h2>
        <button>button outside shadow tree</h2>
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
        <h2>H2 outside shadow tree</h2>
        <button>button outside shadow tree</h2>
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
        <h2>H2 outside shadow tree</h2>
        <button>button outside shadow tree</h2>
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

## Potential Extensions

- **inherit.@sheet**: potential future style groupings like @sheet

@sheet (see [Multiple stylesheets per file #5629](https://github.com/w3c/csswg-drafts/issues/5629)) proposes a mechanism to have named groups of styles, primarily for the purpose of importing groups of styles in Javascript imports.

At-rule support detection in @supports is [not available](https://www.bram.us/2022/01/20/detect-at-rule-support-with-the-at-rule-function/), so @sheet would not be polyfillable, so the shadow layers polyfill does not implement @sheet.

Nonetheless, the styleReferenceList format could easily be extended to support @sheet or other possible future CSS grouping mechanisms:

```css
//Inherit named @sheet as layer
@layer inherit.@sheet.mysheet.as.mysheet, mysheet;
```

However, @layer is already widely deployed so polyfillability is not needed for it, and @layer also already provides the essential priority mechanism.

## Polyfill

The polyfill simulates the referencing capability of `shadowRoot.adoptStyles()` by copying the relevant layers into the shadow tree.

Core function:

- **'adoptStyles(shadowHost, styleReferenceList)'**: A polyfill implementation form of shadowRoot.adoptStyles()

Support functions:

- **`adoptStylesFromAttribute(shadowHost)`**
- **`adoptStylesFromLayerStatementRule(shadowHost)`**
- **`adoptStylesFromSelectors(selectorList, styleReferenceList, adoptFrom = ["styleReferenceList"])`**: adoptFrom = styleReferenceList|adoptStylesAttribute|layerStatementRules

## Conclusion & Proposed CSS Working Group Resolution

["Open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) was opened in 2020 to address the strongly perceived view that "strong style encapsulation is a major hinderance - perhaps the primary obstacle - to using shadow DOM".

Since then, a large outpouring of sentiment, comments, and proposals have validated this strong perception.

The CSS Working Group can encourage proceeding to a solution and resolution of this longstanding open-stylable issue with a resolution like:

- **Resolved**: Add an adoptStyles capability in shadowRoots (WICG Issue #909: open-stylable Shadow Roots)

The CSS Working Group can guide resolution of the declarative parse location for the open-stylable issue with a resolution like:

- **Resolved**: The declarative parse location for an adoptStyles capability in shadowRoots should be CSSLayerStatementRules in the inner context of the shadow host

# Shadow Layers

This repository contains a Shadow Layers proposal to address ["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) with a "proof of concept" implementation using TDD Web Platform Tests.

Shadow Layers proposes to extend CSS cascade layers when used in the inner context of shadow trees so that document-level CSS from the context outside a shadow tree can be referenced, priortized, and brought in as layers inside the context of a shadow tree.

In an @layer statement rule inside a shadow tree:

```css
@layer buttons, inherit.BETTER-BUTTONS;
```

Or in an attribute on the shadow host element:

```html
<custom-element shadowlayers="buttons, inherit.BETTER-BUTTONS">
</custom-element>
```

To bring in all of a document's CSS as a layer named "inherit" inside a shadow tree:

```css
@layer inherit;
```

To bring in a layer from a parent shadow tree into a child shadow tree:

```css
@layer revert.BETTER-BUTTONS;
```

## Issue Background

["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) was opened in 2020 for the primary use case of component library maintainers who want to move to web components while supporting stylesheets that they don't control.

Subsequently, cascade layers (2022) and declarative shadow DOM (2024) landed in major browsers, opening potential new avenues to consider around priority and declarative design.

## Shadow Layers Discussion

For discussion of cascade layers as a potential approach, see [this introductory comment](https://github.com/WICG/webcomponents/issues/909#issuecomment-1971878378), with follow up discussion on

- [priority vs. specificity](https://github.com/WICG/webcomponents/issues/909#issuecomment-1973774453)
- [elaboration on priority vs. specificity](https://github.com/WICG/webcomponents/issues/909#issuecomment-1984766597)
- [declarative shadow DOM](https://github.com/WICG/webcomponents/issues/909#issuecomment-1973994043)
- [crossing shadow boundary](https://github.com/WICG/webcomponents/issues/909#issuecomment-1976805495)
- [crossing shadow boundary not needed for use cases](https://github.com/WICG/webcomponents/issues/909#issuecomment-1977302028)
- [shadow trees in shadow trees](https://github.com/WICG/webcomponents/issues/909#issuecomment-1977706818)
- [pull coordination](https://github.com/WICG/webcomponents/issues/909#issuecomment-1977561057) and [pull vs. push](https://github.com/WICG/webcomponents/issues/909#issuecomment-1977721748)
- [imperative and declarative use cases](https://github.com/WICG/webcomponents/issues/909#issuecomment-1979354145)

## Proposal

The two key parts of the proposal are:

- A `@layer` context-aware layer naming syntax to reference outer context layers
- A custom element `shadowlayers` attribute to override @layer inside a shadow tree

Although not so easily implementable in a proof-of-concept, it may may make sense to also add a new shadow layers option to attachShadow().

### `@layer` Context-aware Layer Naming Syntax

An @layer layer naming syntax to reference outer context layers inside the inner context of a shadow tree:

```html
@layer buttons, inherit.BETTER-BUTTONS;
```

In context:

```html
<body>
  <style>
    @layer BETTER-BUTTONS {
      button {
        padding: 1em;
        border: thick dashed blue;
      }
    }
  </style>
  <custom-element-with-shadow-layer-statement-rule>
    <template shadowrootmode="open">
      <style>
        @layer buttons, inherit.BETTER-BUTTONS;

        @layer buttons {
          button {
            padding: 1em;
            border: 1px solid #000;
          }
        }
      </style>
      <button>
        custom element with "buttons inherit.BETTER-BUTTONS" shadow @layer
        statement rule
      </button>
    </template>
  </custom-element-with-shadow-layer-statement-rule>
</body>
```

Use the keyword "revert" instead of "inherit" to bring in a layer defined inside a parent shadow tree.

Although neither term "inherit" nor "revert" would necessarily have the same meaning in this use as in other uses, they are on the short list of CSS-wide keywords (in cascade level 5) conveniently available as [reserved-for-future-use](https://drafts.csswg.org/css-cascade-5/#layer-names) layer names.

### Custom Element `shadowlayers` Attribute

```html
<body>
  <style>
    @layer BETTER-BUTTONS {
      button {
        padding: 1em;
        border: thick dashed blue;
      }
    }
  </style>
  <custom-element-with-attribute shadowlayers="buttons, inherit.BETTER-BUTTONS">
    <template shadowrootmode="open">
      <style>
        @layer buttons;

        @layer buttons {
          button {
            padding: 1em;
            border: 1px solid #000;
          }
        }
      </style>
      <button>
        custom element with "buttons inherit.BETTER-BUTTONS" layers
      </button>
    </template>
  </custom-element-with-attribute>
</body>
```

Note that the `shadowlayers` attribute is on the custom element, not on the template of a declarative shadow tree, because the parsing of a declarative shadow tree removes the template at parse time, and it never appears in the DOM.

## Use Cases Addressed

- **Include all document CSS as a low priority layer inside a shadow tree.** This is the heart of a solution to the original issue as opened.
- **Support both declarative and imperative use.** Declarative shadow trees are fully supported from the onset, as well as imperative use cases.
- **Include selected document CSS as a layer inside a shadow tree.** Selected named outer layers can be brought into a shadow tree by either a shadow tree designer or shadow tree user.
- **Enable layer reprioritization.** Inner and outer context layers can be intermixed and reprioritized.
- **Enable shadow tree designers to bring in document CSS without intervention by a shadow tree user.** If desired, a shadow tree designer can bring in all of or just selected layers of the document outer context CSS, without intervention of the shadow tree user.
- **Enable coordination between shadow tree designers and shadow tree users.** Either can bring in and repriortize outer layers.
- **Enable shadow tree user to add and repriortize layers originally provided by shadow tree designer.** A user can bring in any chosen outer layer, not just those pre-defined by a designer.
- **Enable a shadow tree designer to "advertise" to shadow tree users the CSS priorities of a shadow tree's inner context.** A designer can expose, publish, or document the original layer order of a shadow tree, so that a user can knowingly adjust it or add to it.
- **Polyfillable.** As hopefully implied by this proof of concept implementations.

## Proof of Concept Implementation

The proof of concept implementation uses Javascript APIs to copy outer context layers into the inner context of a shadow tree, adjusting the shadow tree's inner @layer statement rule as needed.

It is assumed that a platform level implementation may have a way to access outer context CSS without copying, perhaps starting at the CSS cascade context step.

Using "revert" to access cascade layers in parent shadow trees is not initially implemented, although as a proof of concept this would also be implemented by a similar copying technique.

The proof of concept uses a simple merging algorithm (concat + filter) that deliberately prevents a user from excluding altogether an inner shadow layer. It thus allows both the @layer form and the attribute form to coexist and coordinate in the same shadow tree. How exactly such an algorithm should work might be an interesting topic of consideration.

The proof of concept implementation uses Web Platform Tests as a TDD approach. You can see the tests in order to follow the development process.

## Shadow Layers Methods: Summary

The ShadowLayers.js file contains a collection of static methods that manipulate CSS layer rules in the style sheets of shadow tree elements. Here is a summary of the methods:

**findLayerStatementRule(shadowTreeElement)**: Finds a CSSLayerStatementRule in the style sheet of a shadow tree element.

**deleteLayerStatementRule(shadowTreeElement)**: Deletes a CSSLayerStatementRule from the style sheet of a shadow tree element.

**inherit(shadowTreeElement, newLayers):** Replaces the inherited layers in the style sheet of a shadow tree element with new layers.

**deleteInheritedLayers(shadowTreeElement, oldLayers)**: Deletes inherited layers from the style sheet of a shadow tree element.

**mergeLayerNames(newLayerNames, shadowLayerNames)**: Merges two arrays of layer names, removing any duplicates.

**insertInheritedLayers(shadowTreeElement, inheritedLayers)**: Inserts inherited layers into the style sheet of a shadow tree element.

**getInheritedLayerCSSText(layerName)**: Retrieves the CSS text of an inherited layer.

**allDocumentCSSAsInheritLayer()**: Retrieves all CSS from the document and wraps it in an inherit layer.

**inheritFromShadowStatementRule(shadowTreeElement)**: Inherits layer names from a shadow layer statement rule in the style sheet of a shadow tree element.

These methods are used to manipulate CSS layers in shadow tree elements, allowing for more granular control over bringing outer context CSS cascade layers into the inner context of a shadow tree.

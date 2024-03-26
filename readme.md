# Shadow Layers

This repository contains a Shadow Layers proposal to address ["open-stylable" Shadow Roots #909](https://github.com/WICG/webcomponents/issues/909) with a "proof of concept" implementation using TDD web platform tests.

The primary use case #909 was opened for in 2020 is component library maintainers who want to move to web components while supporting stylesheets that they don't control. And there are important related use cases.

Since 2020, new standardized features like cascade layers (2022) and declarative shadow DOM (2024) have become available in all modern browsers, opening up new potential approaches to solve this longstanding issue.

Shadow Layers proposes to provide a way to bring in page styles from the outer context of a shadow tree into the inner context of the shadow tree so that document-level CSS from the context outside a shadow tree can be referenced, priortized, and brought in as layers inside the context of a shadow tree.

"Page styles" are CSS rules that are already on the page outside the shadow tree, not ones in CSS files that can be pulled into a shadow tree through a link or import tag, which already work in shadow trees.

This shadow layers proposal is in two parts:

- declarative shadow DOM
- syntax(s?) to access page styles

This proposal is purposely designed to be polyfillable entirely in Javascript, both as a practical necessity to implement a proof of concept but also as a strong preference for polyfillable syntaxes where possible to facilitate adoption.

A large number for TDD web platform tests can be found in the [user-story-tests folder](https://github.com/htmlcomponents/shadow-layers/tree/main/user-story-tests).

## Declarative Shadow DOM

[Declarative shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) solves a fundamental Web platform issue, the declarative subtree problem in markup languages that predates even HTML itself. Until recently, the only way to create a shadow tree was in Javascript.

But that is behind. Now, anyone using or authoring a web component (or designing or using a shadow tree) can use declarative shadow DOM.

To elaborate:

- Shadow trees are "just HTML" (a document fragment attached to a particular element, for which certain css rules apply).
- Shadow trees are not "Custom Elements" i.e elements upgraded by customElements.define() to have a Javascript class instance associated with them. This kind of "Custom Element" is often informally called a "web component" or a "Web Component".
- "Custom Elements" don't encapsulate anything. Shadow trees do the encapsulating (preventing page CSS from entering or exiting the shadow tree).

[Said differently](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom): "Declarative Shadow DOM can be used on its own as a way to encapsulate styles or customize child placement, but it's most powerful when used with Custom Elements".

So declarative shadow DOM already gives web component users a way to present a shadow tree (with user-written CSS styles in it) to the web component. And a way for the web component to accept, reject, or use those styles as it sees fit.

Thus, declarative shadow DOM already answers the often-expressed need on behalf of web component authors to have opt-in say before accepting those styles into web components.

So the shadow layers proposal uses declarative shadow trees to "pull" in page styles. Any page style accessing syntax would therefore of necessity be declarative and work from inside, not outside, the shadow tree.

## Accessing Page Styles

In an @layer statement rule inside a shadow tree:

```css
@layer buttons, inherit.BETTER-BUTTONS;
```

Or in an attribute on the shadow host element:

```html
<custom-element shadowlayers="buttons, inherit.BETTER-BUTTONS">
</custom-element>
```

Note that the shadowlayers attribute is on the custom element, not on the template of a declarative shadow tree, because the parsing of a declarative shadow tree removes the template at parse time, and it never appears in the DOM, making it not polyfillable.

It may be simplest and best while still providing a comprehensive solution to not include an attribute at all, and solely use the @layer syntax.

To bring in all of a document's CSS as a layer named "inherit" inside a shadow tree:

```css
@layer inherit;
```

To bring in a layer from a parent shadow tree into a child shadow tree:

```css
@layer revert.BETTER-BUTTONS;
```

## Layer Renaming Syntax

- **`inherit.reset.as.shadowreset`**: uses an `as` keyword to assign a different layer name to an outer context layer when inherited into a shadow tree's inner context.

```css
//Inherit resets layer as higher priority renamed layer:
@layer inherit.resets.as.shadowresets, resets, shadowresets;

//Inherit resets layer as lower priority renamed layer:
@layer inherit.resets.as.shadowresets, shadowresets, resets;

//Interweave priorities of outer and inner context layers:
@layer inherit.A.as.outerA, inherit.B.as.outerB, outerA, A, B, outerB;
```

The .as. items can appear in any order in the @layer statement rule, because the renamed layer name must also appear in the @layer statement rule.

## Group Referencing Mechanism

- **inherit.unlayered:** inherits outer context unlayerd page styles
- **inherit.layered:** inherits outer context layered page styles

```css
//Inherit unlayered page styles as layer named unlayered:
@layer inherit.unlayered.as.unlayered, unlayered;

//Interweave priorities of outer layered and unlayered styles:
@layer inherit.layered.as.layered, inherit.unlayered.as.unlayered, layered, A, B, unlayered;

//Inherit all outer page styles:
@layer inherit.unlayered.as.unlayered, inherit.unlayered.as.unlayered, layered, unlayered;
```

## @sheet

- **inherit.sheet.sheetname:** inherits outer context @sheet as an inner context layer

[At-rule support detection in @supports](https://www.bram.us/2022/01/20/detect-at-rule-support-with-the-at-rule-function/) is not available, so @sheet would not be polyfillable (see [Multiple stylesheets per file #5629](https://github.com/w3c/csswg-drafts/issues/5629)), so the shadow layers POC does not implement @sheet. However, @layer is widely deployed so polyfillability is not needed for it, and @layer also provides the essential priority mechanism.

Nonetheless, an @sheet supporting syntax would be possible:

```css
//Inherit named @sheet as layer
@layer inherit.sheet.mysheet.as.mysheet, mysheet;
```

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

## Use of CSS-wide Keywords

This shadow layer proposal uses the keywords "inherit" and "revert" to bring in a layer into a shadow tree.

Although neither term "inherit" nor "revert" would necessarily have the same meaning in this use as in other uses, they are on the short list of CSS-wide keywords (in cascade level 5) conveniently available as [reserved-for-future-use](https://drafts.csswg.org/css-cascade-5/#layer-names) layer names.

## Requirements Considered

Although there is no "official" list of requirements for this issue, here is a personal take on requirements that I used in preparing a proof of concept:

**Use cases are intertwined.**

Whether simple (I just want my page resets to work in my shadow tree) or most painful (component and context are controlled by different entities) or in between, use cases trace to the same shadow encapsulation, and loosening encapsulation will likely impact many if not all in some way.

**Declarative shadow DOM is required.**

To me, declarative shadow DOM is required from the onset not just because it is a new thing so logically it must be supported too, but because shadow trees are just HTML and they are what are doing the encapsulating to loosen. And they are a part of the solution.

So Javascript-only solutions are basically out. And polyfillability though not a strict requirement is in this case something of an acid test for completeness.

But also declarative shadow trees already by design address opt-in for imperatively-created web components.

**Context-aware opt-in protection is needed.**

I don't think an opt-in flag or mode that just brings in all page styles would work as expected in all cases. Some shadow styles could unexpectedly lose. Or get pulled back into a specificity race that could feel like shadow trees just gave up.

**Prioritization is required.**

Or maybe just unavoidable, since unlayered styles are of necessity assigned a layer priority. And a limited form of priority for shadow trees already exists in the context step, so any brought-in styles would pass through that step too.

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

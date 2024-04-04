import ShadowLayers from "./ShadowLayers.js";

class AdoptStyles {
  static adoptStyles(shadowHost, styleReferenceList) {
    return ShadowLayers.inherit(shadowHost, styleReferenceList);
  }

  static adoptStylesFromAttribute(shadowHost) {
    return ShadowLayers.inheritFromAttribute(shadowHost);
  }

  static adoptStylesFromLayerStatementRule(shadowHost) {
    return ShadowLayers.inheritFromShadowStatementRule(shadowHost);
  }

  static adoptStylesFromSelectors(
    selectorList,
    styleReferenceList,
    adoptFrom = ["styleReferenceList"]
  ) {
    adoptFrom.forEach((adoptFromItem) => {
      switch (adoptFromItem) {
        case "styleReferenceList":
          AdoptStyles.adoptStylesFromStyleReferenceList(
            selectorList,
            styleReferenceList
          );
          break;
        case "adoptStylesAttribute":
          AdoptStyles.adoptStylesFromAttribute(selectorList);
          break;
        case "layerStatementRules":
          AdoptStyles.adoptStylesFromLayerStatementRule(selectorList);
          break;
        default:
          throw new Error("Invalid adoptFrom value");
      }
    });
  }
}

export const adoptStyles = AdoptStyles.adoptStyles;
export const adoptStylesFromAttribute = AdoptStyles.adoptStylesFromAttribute;
export const adoptStylesFromLayerStatementRule =
  AdoptStyles.adoptStylesFromLayerStatementRule;
export const adoptStylesFromSelectors = AdoptStyles.adoptStylesFromSelectors;

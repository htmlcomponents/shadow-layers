export default class ShadowLayers {
  constructor() {}

  /**
   * Searches for a CSS rule with a given name
   * in the style sheets of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element to search in.
   * @param {string} layerName - The name of the CSS rule to find.
   *
   * @returns {Object|number} - If the CSS rule is found,
   * returns an object with the index of the rule
   * in the style sheet (`ruleIndex`)
   * and the style sheet itself (`styleSheet`).
   * If the CSS rule is not found, returns -1.
   *
   * To get found CSS rule, use:
   *  result.styleSheet.cssRules.item(result.ruleIndex)
   */
  static findLayerBlockRule(shadowTreeElement, layerName) {
    const sheets = shadowTreeElement.shadowRoot.styleSheets;
    return ShadowLayers.findLayerBlockRuleInStyleSheets(sheets, layerName);
  }

  /**
   * Searches for a CSSLayerBlockRule with a given name
   * in a collection of style sheets.
   *
   * @param {CSSStyleSheet[]} styleSheets - The collection of style sheets to search in.
   * @param {string} layerName - The name of the CSSLayerBlockRule to find.
   *
   * @returns {Object|number} - If a CSSLayerBlockRule is found,
   * returns an object with the index of the rule in the style sheet (`ruleIndex`)
   * and the style sheet itself (`styleSheet`).
   * If no CSSLayerBlockRule is found, or if the `styleSheets` parameter is null, returns -1.
   *
   * To get found CSS rule, use:
   *  result.styleSheet.cssRules.item(result.ruleIndex)
   */
  static findLayerBlockRuleInStyleSheets(styleSheets, layerName) {
    let ruleIndex = -1;
    let styleSheet = null;

    if (styleSheets === null) {
      return ruleIndex;
    }

    [...styleSheets].findIndex((currentStyleSheet) => {
      const ruleIndexResult = [...currentStyleSheet.cssRules].findIndex(
        function (cssRule) {
          return (
            cssRule.constructor.name === "CSSLayerBlockRule" &&
            cssRule.name === layerName
          );
        }
      );

      if (ruleIndexResult !== -1) {
        ruleIndex = ruleIndexResult;
        styleSheet = currentStyleSheet;
      }
    });

    if (ruleIndex === -1) {
      return -1;
    }

    return {
      styleSheet,
      ruleIndex,
    };
  }

  /**
   * Searches for a CSSLayerStatementRule
   * in the style sheets of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element to search in.
   *
   * @returns {Object|number} - If a CSSLayerStatementRule is found, returns an object
   * with the index of the rule in the style sheet (`ruleIndex`)
   * and the style sheet itself (`styleSheet`).
   * If no CSSLayerStatementRule is found, returns -1.
   *
   * To get found CSS rule, use:
   *   result.styleSheet.cssRules.item(result.ruleIndex)
   */
  static findLayerStatementRule(shadowTreeElement) {
    let ruleIndex = -1;
    let styleSheet = null;

    const styleSheets = shadowTreeElement.shadowRoot.styleSheets;

    [...styleSheets].findIndex((currentStyleSheet) => {
      const ruleIndexResult = [...currentStyleSheet.cssRules].findIndex(
        function (cssRule) {
          return cssRule.constructor.name === "CSSLayerStatementRule";
        }
      );

      if (ruleIndexResult !== -1) {
        ruleIndex = ruleIndexResult;
        styleSheet = currentStyleSheet;
      }
    });

    if (ruleIndex === -1) {
      return -1;
    }

    return {
      styleSheet,
      ruleIndex,
    };
  }

  /**
   * Inserts a new CSS rule into the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the new rule should be inserted into.
   * @param {string} newRule - The CSS rule to insert.
   *
   * @returns {boolean} - Returns true if the rule is successfully inserted
   * or if the `newRule` parameter is an empty string or null.
   * Returns false if no CSSLayerStatementRule is found
   * in the style sheet of the `shadowTreeElement`.
   */
  static insertRule(shadowTreeElement, newRule) {
    if (newRule.trim().length === 0 || newRule === null) {
      return true;
    }

    const sheetWithLayerStatement =
      ShadowLayers.findLayerStatementRule(shadowTreeElement);
    if (sheetWithLayerStatement === -1) {
      return false;
    }

    sheetWithLayerStatement.styleSheet.insertRule(
      newRule,
      sheetWithLayerStatement.styleSheet.cssRules.length
    );

    return true;
  }

  /**
   * Deletes a CSSLayerBlockRule with a given name from the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the rule should be deleted from.
   * @param {string} layerName - The name of the CSSLayerBlockRule to delete.
   *
   * @returns {boolean} - Returns true if the rule is successfully deleted.
   * Returns false if no CSSLayerBlockRule with the given name is found in the style sheet of the `shadowTreeElement`.
   */
  static deleteLayer(shadowTreeElement, layerName) {
    const sheetWithLayerStatement = ShadowLayers.findLayerBlockRule(
      shadowTreeElement,
      layerName
    );
    if (sheetWithLayerStatement === -1) {
      return false;
    }

    sheetWithLayerStatement.styleSheet.deleteRule(
      sheetWithLayerStatement.ruleIndex
    );

    return true;
  }

  /**
   * Replaces the CSSLayerStatementRule in the style sheet of a shadow tree element with a new rule.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the rule should be replaced in.
   * @param {string[]} layerArray - An array of layer names to be used in the new rule.
   *
   * @returns {boolean} - Returns true if the rule is successfully replaced or if there was no CSSLayerStatementRule to replace.
   * Returns false if the CSSLayerStatementRule could not be deleted.
   */
  static replaceLayerStatementRule(shadowTreeElement, layerArray) {
    const sheetWithLayerStatement =
      ShadowLayers.findLayerStatementRule(shadowTreeElement);
    if (sheetWithLayerStatement !== -1) {
      const deleteResult =
        ShadowLayers.deleteLayerStatementRule(shadowTreeElement);

      if (!deleteResult) {
        return false;
      }
    }

    const newLayerStatementRule = `@layer ${layerArray.join(", ")};`;

    sheetWithLayerStatement.styleSheet.insertRule(newLayerStatementRule, 0);

    return true;
  }

  static deleteLayerStatementRule(shadowTreeElement) {
    const sheetWithLayerStatement =
      ShadowLayers.findLayerStatementRule(shadowTreeElement);
    if (sheetWithLayerStatement === -1) {
      return false;
    }

    sheetWithLayerStatement.styleSheet.deleteRule(
      sheetWithLayerStatement.ruleIndex
    );

    return true;
  }

  /**
   * Deletes a CSSLayerStatementRule from the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the rule should be deleted from.
   *
   * @returns {boolean} - Returns true if the rule is successfully deleted.
   * Returns false if no CSSLayerStatementRule is found in the style sheet of the `shadowTreeElement`.
   */
  static inheritFromAttribute(shadowTreeElement) {
    // get new layers from the attribute
    const newLayersString = shadowTreeElement.getAttribute("shadowlayers");
    if (newLayersString === null) {
      return true;
    }
    const newLayers = newLayersString.split(", ");

    return ShadowLayers.inherit(shadowTreeElement, newLayers);
  }

  /**
   * Replaces the inherited layers in the style sheet of a shadow tree element with new layers.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the inherited layers should be replaced in.
   * @param {string[]} newLayers - An array of new layer names to replace the inherited layers with.
   *
   * @returns {boolean} - Always returns true.
   */
  static inherit(shadowTreeElement, newLayers) {
    const newLayersDotAsDotItemsRemoved =
      ShadowLayers.removeArrayItemsWithDotAsDot(newLayers);
    // get old layers from the shadow tree
    let oldLayers = [];
    const oldLayerStatementRule =
      ShadowLayers.findLayerStatementRule(shadowTreeElement);
    if (oldLayerStatementRule !== -1) {
      const oldLayers = oldLayerStatementRule.styleSheet.cssRules.item(
        oldLayerStatementRule.ruleIndex.nameList
      );
    }

    // delete old inherited layers
    const oldShadowLayers = ShadowLayers.deleteInheritedLayers(
      shadowTreeElement,
      oldLayers
    );

    // insert new inherited layers, intermixed with shadow layers
    const mergedNewLayers = ShadowLayers.mergeLayerNames(
      // newLayers,
      newLayersDotAsDotItemsRemoved,
      oldShadowLayers
    );

    const insertResult = ShadowLayers.insertInheritedLayers(
      shadowTreeElement,
      mergedNewLayers
    );

    // update layer statement rule
    ShadowLayers.replaceLayerStatementRule(shadowTreeElement, mergedNewLayers);
    return true;
  }

  static removeArrayItemsWithDotAsDot(items) {
    return items.filter((item) => !item.includes(".as."));
  }

  /**
   * Deletes inherited layers from the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the inherited layers should be deleted from.
   * @param {string[]} oldLayers - An array of old layer names.
   *
   * @returns {string[]} - Returns an array of the remaining layer names after the inherited layers have been deleted.
   */
  static deleteInheritedLayers(shadowTreeElement, oldLayers) {
    const oldShadowLayers = oldLayers.filter(function (layerName) {
      if (layerName === "inherit" || layerName.startsWith("inherit.")) {
        ShadowLayers.deleteLayer(shadowTreeElement, layerName);
        return false;
      }
      return true;
    });

    return oldShadowLayers;
  }

  /**
   * Merges two arrays of layer names, removing any duplicates.
   *
   * @param {string[]} newLayerNames - An array of new layer names.
   * @param {string[]} shadowLayerNames - An array of shadow layer names.
   *
   * @returns {string[]} - Returns an array of the merged layer names, with duplicates removed.
   */
  static mergeLayerNames(newLayerNames, shadowLayerNames) {
    const concatenatedLayerNames = newLayerNames.concat(shadowLayerNames);
    const filteredLayerNames = concatenatedLayerNames.filter(
      (value, index) => concatenatedLayerNames.lastIndexOf(value) === index
    );
    return filteredLayerNames;
  }

  /**
   * Inserts inherited layers into the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the inherited layers should be inserted into.
   * @param {string[]} inheritedLayers - An array of inherited layer names.
   *
   * @returns {void} - This method does not return anything.
   */
  static insertInheritedLayers(shadowTreeElement, inheritedLayers) {
    inheritedLayers.forEach((layerName) => {
      if (layerName !== "inherit" && !layerName.startsWith("inherit.")) {
        return;
      }

      const inheritedLayerCSSText =
        ShadowLayers.getInheritedLayerCSSText(layerName);

      ShadowLayers.insertRule(shadowTreeElement, inheritedLayerCSSText);
    });
  }

  /**
   * Retrieves the CSS text of an inherited layer.
   *
   * @param {string} layerName - The name of the inherited layer.
   *
   * @returns {string} - Returns the CSS text of the inherited layer. If the layer is named "inherit", it returns all document CSS as an inherited layer. If the layer is not found, it returns an empty string.
   */
  static getInheritedLayerCSSText(layerName) {
    if (layerName === "inherit") {
      return ShadowLayers.allDocumentCSSAsInheritLayer();
    }
    const documentLayerName = layerName.replace("inherit.", "");
    const layerRule = ShadowLayers.findLayerBlockRuleInStyleSheets(
      document.styleSheets,
      documentLayerName
    );
    if (layerRule === -1) {
      return "";
    }
    const cssText = layerRule.styleSheet.cssRules.item(
      layerRule.ruleIndex
    ).cssText;
    return cssText.replace(documentLayerName, `inherit.${documentLayerName}`);
  }

  /**
   * Retrieves all CSS from the document and wraps it in an inherit layer.
   *
   * @returns {string} - Returns a string that represents all the CSS in the document wrapped in an inherit layer.
   */
  static allDocumentCSSAsInheritLayer() {
    let cssText = "";
    [...document.styleSheets].forEach((styleSheet) => {
      [...styleSheet.cssRules].forEach((cssRule) => {
        cssText += cssRule.cssText;
      });
    });
    return `@layer inherit {${cssText}}`;
  }

  /**
   * Inherits layer names from a shadow layer statement rule in the style sheet of a shadow tree element.
   *
   * @param {HTMLElement} shadowTreeElement - The shadow tree element whose style sheet the layer names should be inherited from.
   *
   * @returns {boolean|void} - Returns false if no shadow layer statement rule is found in the style sheet of the `shadowTreeElement`. Otherwise, it calls the `inherit` method and does not return anything.
   */
  static inheritFromShadowStatementRule(shadowTreeElement) {
    const shadowLayerStatementRule =
      ShadowLayers.findLayerStatementRule(shadowTreeElement);
    if (shadowLayerStatementRule === -1) {
      return false;
    }
    const shadowLayerNames = shadowLayerStatementRule.styleSheet.cssRules.item(
      shadowLayerStatementRule.ruleIndex
    ).nameList;

    ShadowLayers.insertDotAsDotLayers(shadowTreeElement, shadowLayerNames);

    return ShadowLayers.inherit(shadowTreeElement, shadowLayerNames);
  }

  static insertDotAsDotLayers(shadowTreeElement, layers) {
    let dotAsDotLayer;
    let inheritedLayerCSSText;
    layers.forEach((layerName) => {
      dotAsDotLayer = ShadowLayers.GetLayerNameAndRenamedLayerName(layerName);
      if (dotAsDotLayer === false) {
        return;
      }
      inheritedLayerCSSText =
        ShadowLayers.getDotAsDotLayerCSSText(dotAsDotLayer);

      ShadowLayers.insertRule(shadowTreeElement, inheritedLayerCSSText);
    });
  }

  static GetLayerNameAndRenamedLayerName(layerNameString) {
    if (!layerNameString.startsWith("inherit.")) {
      return false;
    }

    const parts = layerNameString.split(".as.");

    if (parts.length !== 2) {
      return false;
    }

    let layername = parts[0].split(".").slice(1).join(".");
    const renamedlayername = parts[1];

    if (!layername || !renamedlayername) {
      return false;
    }

    return { layername, renamedlayername };
  }

  static getDotAsDotLayerCSSText(layerObject) {
    switch (layerObject.layername) {
      case "unlayered":
        return ShadowLayers.getUnlayeredLayerCSSText(layerObject);
      case "layered":
        return ShadowLayers.getLayeredLayerCSSText(layerObject);
      default:
        break;
    }

    const cssTextOfCssFileWithLayerName =
      ShadowLayers.getCssTextOfImportedCssFileWithLayerName(layerObject);
    if (cssTextOfCssFileWithLayerName !== "") {
      return cssTextOfCssFileWithLayerName;
    }

    const layerRule = ShadowLayers.findLayerBlockRuleInStyleSheets(
      document.styleSheets,
      layerObject.layername
    );

    if (layerRule === -1) {
      return "";
    }
    const cssText = layerRule.styleSheet.cssRules.item(
      layerRule.ruleIndex
    ).cssText;

    return cssText.replace(
      layerObject.layername,
      `${layerObject.renamedlayername}`
    );
  }

  static getUnlayeredLayerCSSText(layerObject) {
    let cssText = "";
    [...document.styleSheets].forEach((styleSheet) => {
      [...styleSheet.cssRules].forEach((cssRule) => {
        if (cssRule.cssText.startsWith("@layer")) {
          return;
        }
        cssText += cssRule.cssText;
      });
    });

    return `@layer ${layerObject.renamedlayername} {${cssText}}`;
  }

  static getLayeredLayerCSSText(layerObject) {
    let cssText = "";
    [...document.styleSheets].forEach((styleSheet) => {
      [...styleSheet.cssRules].forEach((cssRule) => {
        if (cssRule instanceof CSSImportRule && cssRule.layerName !== null) {
          let importRulesCssText = "";
          const importCssRules = cssRule.styleSheet.cssRules;
          [...importCssRules].forEach((cssRule) => {
            importRulesCssText += cssRule.cssText;
          });
          const importRulesCssTextInLayer = `@layer ${cssRule.layerName} {
${importRulesCssText}
}`;
          cssText += importRulesCssTextInLayer;
        }

        if (cssRule.cssText.startsWith("@layer")) {
          cssText += cssRule.cssText;
        }
      });
    });

    return `@layer ${layerObject.renamedlayername} {${cssText}}`;
  }

  static getCssTextOfImportedCssFileWithLayerName(layerObject) {
    let cssText = "";
    [...document.styleSheets].forEach((styleSheet) => {
      [...styleSheet.cssRules].forEach((cssRule) => {
        if (
          cssRule instanceof CSSImportRule &&
          cssRule.layerName === layerObject.layername
        ) {
          const importCssRules = cssRule.styleSheet.cssRules;
          [...importCssRules].forEach((cssRule) => {
            cssText += cssRule.cssText;
          });
        }
      });
    });

    if (cssText === "") {
      return "";
    }

    const layeredCssText = `@layer ${layerObject.renamedlayername} {${cssText}}`;
    console.log(layeredCssText);
    return layeredCssText;
  }
}

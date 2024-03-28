import { unified } from "https://esm.sh/unified@11?bundle";
import remarkParse from "https://esm.sh/remark-parse@11?bundle";
import remarkRehype from "https://esm.sh/remark-rehype@11?bundle";
import rehypeStringify from "https://esm.sh/rehype-stringify@10?bundle";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter@5?bundle";
import remarkGfm from "https://esm.sh/remark-gfm@4?bundle";

import ShadowLayers from "../../ShadowLayers.js";

export class MDBlockWithUserSelectablePageStyles extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.shadowRoot;
    const markdown = this.getMarkdownFromScriptTag();
    const transformedMarkdown = await this.markdown2HTML(markdown);
    console.log(transformedMarkdown);
    console.log("Shadow:", shadow);

    const style = `
    <style>
        @layer md-block-default-styles {
          h3 {
            border: thick solid black;
          }
        };
    </style>
    `;
    const transformedMarkdownWithShadowStyle = `
        ${style}
        <article>
        ${transformedMarkdown}
        </article>
        `;

    const template = document.createElement("template");
    template.innerHTML = transformedMarkdownWithShadowStyle;
    const nodes = template.content;
    console.log("Nodes:", nodes);
    shadow.append(nodes);

    const inheritResult = ShadowLayers.inheritFromShadowStatementRule(
      document.querySelector("md-block-with-user-selectable-page-styles")
    );
  }

  async markdown2HTML(markdown) {
    let html = "";
    try {
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .use(remarkFrontmatter)
        .process(markdown);
      html = String(result);
    } catch (error) {
      console.log(error);
    }
    return html;
  }

  getMarkdownFromScriptTag() {
    let markdown = "";
    let scriptElement = null;

    scriptElement = this.querySelector(`script[type='text/markdown']`);

    if (!scriptElement) {
      return markdown;
    }
    markdown = scriptElement.text.trim();

    return markdown;
  }
}

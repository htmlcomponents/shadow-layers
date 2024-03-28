import { unified } from "https://esm.sh/unified@11?bundle";
import remarkParse from "https://esm.sh/remark-parse@11?bundle";
import remarkRehype from "https://esm.sh/remark-rehype@11?bundle";
import rehypeStringify from "https://esm.sh/rehype-stringify@10?bundle";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter@5?bundle";
import remarkGfm from "https://esm.sh/remark-gfm@4?bundle";

import ShadowLayers from "../../ShadowLayers.js";

export class MDBlockWithAuthorDefinedLowerPriorityShadowLayer extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const markdown = this.getMarkdownFromScriptTag();
    const transformedMarkdown = await this.markdown2HTML(markdown);
    const style = `
<style>
    @layer markdown-styles, inherit;
    @layer markdown-styles {
        h3 {
            border: thick solid black;
        }
    }

</style>
`;
    const shadowWithStyle = `
    ${style}
    ${transformedMarkdown}
    `;
    shadow.innerHTML = shadowWithStyle;

    const inheritResult = ShadowLayers.inheritFromShadowStatementRule(
      document.querySelector(
        "md-block-with-author-defined-lower-priority-shadow-layer"
      )
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

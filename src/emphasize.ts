import chalk from "chalk";
import hljs from "highlight.js";
import jsdom from "jsdom";

const defaultStyles = new Map([
  ["comment", chalk.gray],
  ["quote", chalk.gray],
  ["keyword", chalk.red],
  ["selector-tag", chalk.green],
  ["addition", chalk.green],
  ["number", chalk.keyword('orange')],
  ["string", chalk.green],
  ["meta meta-string", chalk.cyan],
  ["literal", chalk.cyan],
  ["doctag", chalk.cyan],
  ["regexp", chalk.cyan],
  ["title", chalk.blue],
  ["section", chalk.blue],
  ["name", chalk.blue],
  ["selector-id", chalk.blue],
  ["selector-class", chalk.blue],
  ["attribute", chalk.yellow],
  ["attr", chalk.yellow],
  ["variable", chalk.yellow],
  ["template-variable", chalk.yellow],
  ["class title", chalk.yellow],
  ["type", chalk.yellow],
  ["symbol", chalk.magenta],
  ["bullet", chalk.magenta],
  ["subst", chalk.magenta],
  ["meta", chalk.magenta],
  ["meta keyword", chalk.magenta],
  ["selector-attr", chalk.magenta],
  ["selector-pseudo", chalk.magenta],
  ["link", chalk.magenta],
  ["built_in", chalk.yellow],
  ["deletion", chalk.magentaBright],
  ["emphasis", chalk.italic],
  ["strong", chalk.bold],
  ["formula", chalk.inverse],
  ["function", chalk.cyan],
  ["params", chalk.white]
]);

export function highlight(code: string) {
  const highlightedCode = hljs.highlightAuto(code).value;

  const p = new jsdom.JSDOM(highlightedCode);
  const r = Array.from(p.window.document.querySelectorAll("*")).map(
    (node) => {
      return formatNode(node);
    }
  );

  return r.join("");
}

function formatNode(node: Node): string {
  if (!node.hasChildNodes()) {
    const parentClass = node.parentElement?.classList[0] || "";

    const classKey = parentClass.replace("hljs-", "");

    const text = node.textContent || "";

    if (!defaultStyles.has(classKey)) {
      console.warn("space nodes", text, parentClass)
      return text;
    }

    const style = defaultStyles.get(classKey);

    if (style) {
      return style(text);
    }

    return text;
  }

  const children = Array.from(node.childNodes).map((child) =>
    formatNode(child)
  );

  return children.join("");
}

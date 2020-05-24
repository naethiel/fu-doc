import chalk from "chalk";
import hljs from "highlight.js";
import jsdom from "jsdom";

const defaultStyles = {
  comment: chalk.gray,
  quote: chalk.gray,
  keyword: chalk.red,
  "selector-tag": chalk.green,
  addition: chalk.green,
  number: chalk.keyword("orange"),
  string: chalk.green,
  "meta meta-string": chalk.cyan,
  literal: chalk.cyan,
  doctag: chalk.cyan,
  regexp: chalk.cyan,
  title: chalk.blue,
  section: chalk.blue,
  name: chalk.blue,
  "selector-id": chalk.blue,
  "selector-class": chalk.blue,
  attribute: chalk.yellow,
  attr: chalk.yellow,
  variable: chalk.yellow,
  "template-variable": chalk.yellow,
  "class title": chalk.yellow,
  type: chalk.yellow,
  symbol: chalk.magenta,
  bullet: chalk.magenta,
  subst: chalk.magenta,
  meta: chalk.magenta,
  "meta keyword": chalk.magenta,
  "selector-attr": chalk.magenta,
  "selector-pseudo": chalk.magenta,
  link: chalk.magenta,
  built_in: chalk.yellow,
  deletion: chalk.magentaBright,
  emphasis: chalk.italic,
  strong: chalk.bold,
  formula: chalk.inverse,
  function: chalk.cyan,
  params: chalk.white,
};

function getStyle(stylesMap: { [key: string]: chalk.Chalk }, key: string) {
  const keys = Object.keys(stylesMap);

  if (!keys.includes(key)) {
    return null;
  }

  return stylesMap[key];
}

export function highlight(code: string) {
  const highlightedCode = hljs.highlightAuto(code).value;

  const p = new jsdom.JSDOM(
    "<div id='highlight-content'>" + highlightedCode + "</div>"
  );

  const rootNode = p.window.document.querySelector("#highlight-content");

  if (!rootNode) {
    return code;
  }

  try {
    return formatNode(rootNode);
  } catch (error) {
    console.error("could not highlight code properly", error);
    return code;
  }
}

function formatNode(node: Node): string {
  if (!node.hasChildNodes()) {
    const parentClass = node.parentElement?.classList[0] || "";

    const classKey = parentClass.replace("hljs-", "");
    const text = node.textContent || "";

    const styleFunc = getStyle(defaultStyles, classKey);

    if (!styleFunc) {
      return text;
    }

    return styleFunc(text);
  } else {
    const children = Array.from(node.childNodes).map((child) => {
      return formatNode(child);
    });

    return children.join("");
  }
}

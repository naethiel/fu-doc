import TurndownService from "turndown";
import chalk from "chalk";
import { page, config } from "./api";
import { highlight } from "./emphasize";

export const styles = {
  heading: chalk.bold.cyanBright,
  strong: chalk.bold.cyan,
  em: chalk.underline,
  summary: chalk.whiteBright,
  code: chalk.magentaBright,
  aside: chalk.gray,
};

const log = console.log;
const markdown = new TurndownService()
  .addRule("strong-color", {
    filter: ["b", "strong"],
    replacement: function (content, node, options) {
      return styles.strong(content);
    },
  })
  .addRule("emphasis-color", {
    filter: ["i", "em"],
    replacement: function (content, node, options) {
      return styles.em(content);
    },
  })
  .addRule("headings-color", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node, options) {
      const hLevel = Number(node.nodeName.charAt(1));

      let s = "\n";

      for (let i = 0; i < hLevel; i++) {
        s += "#";
      }

      s += " " + content + "\n";

      return styles.heading(s);
    },
  })
  .addRule("code-color", {
    filter: ["pre"],
    replacement: function (_content, node, options): string {
      const text = node.textContent ?? "";
      return highlight(text);
      
    },
  });

export function printSummary(p: page) {
  const pageTitle = markdown.turndown(p.title);
  const pageSummary = markdown.turndown(p.summary);

  log(styles.heading("\n" + pageTitle + "\n"));
  log(styles.summary(pageSummary));
  log(styles.aside("\nSee full page: " + config.BASE_URL + p.url));
  log("\n\n");
}

export function printPageSection(s: string) {
  let md = markdown.turndown(s);

  md = md.replace(/(`)(?:.+?)(`)/g, function (match): string {
    return styles.code(match);
  });

  log(md);
}

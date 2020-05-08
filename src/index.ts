#!/usr/bin/env node
import fetch from "node-fetch";
import inquirer from "inquirer";
import TurndownService from "turndown";
import chalk from "chalk";

interface searchResults {
  documents: Array<{
    title: string;
    slug: string;
    locale: string;
    excerpt: string;
  }>;
}

interface page {
  title: string;
  summary: string;
  subpages: Array<page>;
  url: string;
  sections: Array<any>;
  slug: string;
  uuid: string;
}

const BASE_URL = `https://developer.mozilla.org`;
const LOCALE = "en-US";
const query = process.argv.slice(2).join(" ");

async function run() {
  if (!query) {
    throw new Error("No search keyword");
  }

  const results = await search(query);

  const selection = await inquirer.prompt({
    type: "list",
    name: "page",
    message: `You searched for ${query}. Select a result:`,
    choices: results.documents.map((doc) => ({
      name: doc.title,
      value: doc.slug,
    })),
  });

  const selectedResult = results.documents.find(
    (doc) => doc.slug === selection.page
  );

  if (!selectedResult) {
    throw new Error("selection is not in results");
  }

  const page = await getPage(selectedResult.slug);

  printSummary(page);

  if (page.sections.length) {
    const more: { section: string } = await inquirer.prompt({
      type: "list",
      name: "section",
      message: "Read more:",
      choices: page.sections.map((s) => ({ name: s.title, value: s.id })),
    });

    const sectionHtml = await getSection(page.url, more.section);

    printSection(sectionHtml);
  }
}

run().catch((err) => {
  console.error("Something went wrong: ", err);
});

function search(query: string): Promise<searchResults> {
  return fetch(
    `${BASE_URL}/${LOCALE}/search.json?highlight=false&per_page=20&q=${query}`
  ).then((r) => r.json());
}

async function getPage(slug: string): Promise<page> {
  const r = await fetch(`${BASE_URL}/${LOCALE}/docs/${slug}$children?expand`);

  return await r.json();
}

async function getSection(pageUrl: string, sectionId: string): Promise<string> {
  return fetch(
    `${BASE_URL}/${pageUrl}?section=${sectionId}&raw&macros`
  ).then((r) => r.text());
}

function printSummary(p: page) {
  const bold = chalk.bold.red;
  const turndownService = new TurndownService().addRule("strong", {
    filter: ["strong", "b"],
    replacement: function (content, _node, options) {
      return bold(
        `${options.strongDelimiter}${content}${options.strongDelimiter}`
      );
    },
  });

  const pageTitle = turndownService.turndown(p.title);
  const pageSummary = turndownService.turndown(p.summary);
  const title = chalk.bold.green;
  const summary = chalk.bold.white;
  console.log(" ");
  console.log(title(pageTitle));
  console.log(title("------"));
  console.log(summary(pageSummary));
  console.log(" ");
}

function printSection(s: string) {
  const turndownService = new TurndownService();
  console.log(" ");
  console.log(turndownService.turndown(s));
}

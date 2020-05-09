#!/usr/bin/env node
import { getSearchResults, getPage, getPageSection } from "./api";
import { choosePageSection, choosePage } from "./questions";
import { printSummary, printPageSection } from "./print";

async function run() {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    throw new Error("No search keyword");
  }

  const results = await getSearchResults(query);

  const chosenPage = await choosePage(results, query);

  if (!chosenPage) {
    throw new Error("chosen page not in results");
  }

  const page = await getPage(chosenPage.slug);

  printSummary(page);

  const pageSectionId = await choosePageSection(page);

  const section = await getPageSection(page.url, pageSectionId);

  printPageSection(section);
}

run().catch((err) => {
  console.error("Something went wrong: ", err);
});

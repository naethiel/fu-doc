#!/usr/bin/env node
import { getSearchResults, getPage, getPageSection, page } from "./api";
import { choosePageSection, choosePage } from "./questions";
import { printSummary, printPageSection } from "./print";
import parseArgs from "minimist";

async function run() {
  const args = parseArgs(process.argv.slice(2));

  const query = args._.join(" ");
  const fastSearch: string = args.f;

  if (!query && !fastSearch) {
    throw new Error("No search keyword");
  }

  let page: page;

  if (fastSearch) {
    const [result] = await getSearchResults(fastSearch, 1);

    page = await getPage(result.slug);
  } else {
    const results = await getSearchResults(query);

    const chosenPage = await choosePage(results, query);

    if (!chosenPage) {
      throw new Error("chosen page not in results");
    }

    page = await getPage(chosenPage.slug);
  }

  printSummary(page);

  const pageSectionId = await choosePageSection(page);

  const section = await getPageSection(page.url, pageSectionId);

  printPageSection(section);
}

run().catch((err) => {
  console.error("Something went wrong: ", err);
});

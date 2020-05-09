import fetch from "node-fetch";

export const config = {
  BASE_URL: `https://developer.mozilla.org`,
  LOCALE: "en-US",
};

type searchResults = Array<{
  readonly title: string;
  readonly slug: string;
  readonly locale: string;
  readonly excerpt: string;
}>;

export interface page {
  readonly title: string;
  readonly summary: string;
  readonly subpages: Array<page>;
  readonly url: string;
  readonly sections: Array<{ title: string; id: string }>;
  readonly slug: string;
  readonly uuid: string;
}

export function getPage(slug: string): Promise<page> {
  return fetch(
    `${config.BASE_URL}/${config.LOCALE}/docs/${slug}$children?expand`
  ).then((r) => r.json());
}

export function getPageSection(
  pageUrl: string,
  sectionId: string
): Promise<string> {
  return fetch(
    `${config.BASE_URL}/${pageUrl}?section=${sectionId}&raw&macros`
  ).then((r) => r.text());
}

export function getSearchResults(query: string): Promise<searchResults> {
  return fetch(
    `${config.BASE_URL}/${config.LOCALE}/search.json?highlight=false&per_page=20&q=${query}`
  )
    .then((r) => r.json())
    .then((r: { documents: searchResults }) => r.documents);
}

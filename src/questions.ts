import inquirer from "inquirer";
import { page } from "./api";

export async function choosePageSection(page: page): Promise<string> {
  const { sectionId }: { sectionId: string } = await inquirer.prompt({
    type: "list",
    name: "sectionId",
    message: "Read more:",
    choices: page.sections.map((s) => ({ name: s.title, value: s.id })),
  });

  return sectionId;
}

export async function choosePage(
  list: Array<{ title: string; slug: string }>,
  query: string
): Promise<{ title: string; slug: string } | null> {
  const selection = await inquirer.prompt({
    type: "list",
    name: "page",
    message: `You searched for ${query}. Select a result:`,
    choices: list.map((doc) => ({
      name: doc.title,
      value: doc.slug,
    })),
  });

  return list.find((doc) => doc.slug === selection.page) || null;
}

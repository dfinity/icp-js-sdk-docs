import { type MultiSidebarConfig } from "../../config.ts";

type Header = MultiSidebarConfig["sidebars"][number]["header"];

export type HeaderItem = {
  basePath: MultiSidebarConfig["sidebars"][number]["basePath"];
  header: Header;
};

export type HeadersByCategory = Record<
  Header["category"],
  {
    items: Array<HeaderItem>;
  }
>;

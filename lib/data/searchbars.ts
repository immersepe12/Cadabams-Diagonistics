import searchbarsData from "@/data/allpages/_shared/searchbars.json";

export interface SearchbarContent {
  placeholder: string;
  id: string;
}

export interface SearchbarConfig {
  id: string;
  visible: boolean;
  content: SearchbarContent;
}

export function getSearchbar(): SearchbarConfig {
  return (searchbarsData as SearchbarConfig[])[0];
}

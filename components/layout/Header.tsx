import { getNavbar } from "@/lib/data/navbars";
import {
  getAllCenters,
  getCenterSlug,
  getCenterShortName,
} from "@/lib/data/centers";
import {
  getAllNonLabTestCategories,
  getNonLabCategorySlug,
} from "@/lib/data/nonlabtests";
import { HeaderClient } from "./HeaderClient";

export function Header() {
  const navbar = getNavbar();

  const centers = getAllCenters()
    .map((c) => ({
      name: getCenterShortName(c),
      slug: getCenterSlug(c),
    }))
    .filter((c) => c.name && c.slug);

  const radiologyCategories = getAllNonLabTestCategories()
    .map((c) => ({
      name: c.name,
      slug: getNonLabCategorySlug(c),
    }))
    .filter((c) => c.name.trim().length > 0 && c.slug.length > 0);

  return (
    <HeaderClient
      logo={navbar.content.logo}
      centers={centers}
      radiologyCategories={radiologyCategories}
    />
  );
}

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
import {
  getAllLabTestCategories,
  getCategorySlug,
  getLabTestsByCategoryId,
} from "@/lib/data/labtests";
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

  const labTestCategories = getAllLabTestCategories()
    // Only categories that actually have tests (mirrors the lab-test page,
    // which hides empty categories like "Gut Health").
    .filter((c) => getLabTestsByCategoryId(c.id).length > 0)
    .map((c) => ({
      name: c.name,
      slug: getCategorySlug(c),
    }))
    .filter((c) => c.name.trim().length > 0 && c.slug.length > 0);

  return (
    <HeaderClient
      logo={navbar.content.logo}
      centers={centers}
      radiologyCategories={radiologyCategories}
      labTestCategories={labTestCategories}
    />
  );
}

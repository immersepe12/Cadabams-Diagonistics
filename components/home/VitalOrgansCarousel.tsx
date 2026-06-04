import { VitalOrganTile, type VitalOrganItem } from "./VitalOrganTile";
import { VitalOrgansSlider } from "./VitalOrgansSlider";

export type { VitalOrganItem };

export function VitalOrgansCarousel({ items }: { items: VitalOrganItem[] }) {
  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile / tablet: swipeable carousel, consistent with the other sliders. */}
      <div className="lg:hidden">
        <VitalOrgansSlider items={items} />
      </div>

      {/* Desktop: full grid so every specialty is visible at once. */}
      <ul className="hidden lg:grid grid-cols-6 gap-4">
        {items.map((cat, i) => (
          <li key={cat.id}>
            <VitalOrganTile item={cat} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}

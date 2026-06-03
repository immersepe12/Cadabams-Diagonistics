import Image from "next/image";

interface PromoBannersProps {
  banners: string[];
}

export function PromoBanners({ banners }: PromoBannersProps) {
  if (banners.length === 0) return null;
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-gutter">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[16/9] rounded-md overflow-hidden shadow-sh-2"
            >
              <Image
                src={src}
                alt={`Promotion ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

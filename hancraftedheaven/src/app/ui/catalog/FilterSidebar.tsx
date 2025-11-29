"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  categories: { category_id: string; category_name: string }[];
  sellers: { id: string; name: string }[];
};

export default function FilterSidebar({ categories, sellers }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      ),
    [categories]
  );
  const orderedSellers = useMemo(
    () => [...sellers].sort((a, b) => a.name.localeCompare(b.name)),
    [sellers]
  );

  const [openCat, setOpenCat] = useState(false);
  const [openSel, setOpenSel] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  useEffect(() => {
    if (searchParams.get("categories")) setOpenCat(true);
    if (searchParams.get("sellers")) setOpenSel(true);
    if (searchParams.get("price")) setOpenPrice(true);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasAny =
    !!searchParams.get("categories") ||
    !!searchParams.get("sellers") ||
    !!searchParams.get("price");

  const radioClass = "mr-3 accent-[#ffe0b2] scale-90 sm:scale-100";

  const Row = ({
    label,
    open,
    onToggle,
  }: {
    label: string;
    open: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 sm:py-4 px-1 border-b border-[#bcaaa4]"
      aria-expanded={open}
      aria-controls={`${label.replace(/\s+/g, "-").toLowerCase()}-panel`}
    >
      <span className="uppercase tracking-wide font-extrabold text-base sm:text-[17px] text-white">
        {label}
      </span>
      <span className="text-xl sm:text-2xl text-white leading-none select-none">
        {open ? "–" : "+"}
      </span>
    </button>
  );

  const Panel = ({
    id,
    open,
    children,
  }: {
    id: string;
    open: boolean;
    children: React.ReactNode;
  }) => (
    <div
      id={id}
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
        open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="py-2 sm:py-3">{children}</div>
    </div>
  );

  return (
    <aside className="bg-[#4e342e] text-white border-2 border-[#3e2723] rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6">
      <h2 className="uppercase text-[#ffe0b2] font-bold tracking-wide border-b border-[#bcaaa4] pb-2 mb-1 text-xl sm:text-2xl">
        Filter Products
      </h2>

      <Row
        label="Categories"
        open={openCat}
        onToggle={() => setOpenCat((v) => !v)}
      />
      <Panel id="categories-panel" open={openCat}>
        <div className="space-y-2">
          {orderedCategories.map((cat) => (
            <label
              key={cat.category_id}
              className="flex items-center text-[15px] sm:text-sm"
            >
              <input
                type="radio"
                name="category"
                value={cat.category_id}
                checked={searchParams.get("categories") === cat.category_id}
                onChange={() =>
                  handleFilterChange("categories", cat.category_id)
                }
                className={radioClass}
              />
              {cat.category_name}
            </label>
          ))}
        </div>
      </Panel>

      <Row
        label="Artisans"
        open={openSel}
        onToggle={() => setOpenSel((v) => !v)}
      />
      <Panel id="artisans-panel" open={openSel}>
        <div className="space-y-2">
          {orderedSellers.map((s) => (
            <label
              key={s.id}
              className="flex items-center text-[15px] sm:text-sm"
            >
              <input
                type="radio"
                name="seller"
                value={s.id}
                checked={searchParams.get("sellers") === s.id}
                onChange={() => handleFilterChange("sellers", s.id)}
                className={radioClass}
              />
              {s.name}
            </label>
          ))}
        </div>
      </Panel>

      <Row
        label="Price Range"
        open={openPrice}
        onToggle={() => setOpenPrice((v) => !v)}
      />
      <Panel id="price-range-panel" open={openPrice}>
        <div className="space-y-2">
          {[
            { value: "under-15", label: "Under $15" },
            { value: "15-30", label: "$15 – $30" },
            { value: "above-30", label: "Above $30" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center text-[15px] sm:text-sm"
            >
              <input
                type="radio"
                name="price"
                value={value}
                checked={searchParams.get("price") === value}
                onChange={() => handleFilterChange("price", value)}
                className={radioClass}
              />
              {label}
            </label>
          ))}
        </div>
      </Panel>

      <div className="flex justify-center pt-3 sm:pt-4">
        <button
          onClick={() => router.push(pathname, { scroll: false })}
          className={`text-sm ${
            hasAny
              ? "text-[#ffe0b2] hover:underline"
              : "text-[#ffe0b2]/50 cursor-not-allowed"
          }`}
          disabled={!hasAny}
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}

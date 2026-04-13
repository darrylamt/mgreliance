"use client";

import { cn } from "@/lib/utils";

type FilterValue = "all" | "residential" | "commercial" | "land";

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Land", value: "land" },
];

interface PropertyFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function PropertyFilter({
  active,
  onChange,
}: PropertyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
            active === filter.value
              ? "bg-primary text-white shadow-md"
              : "bg-white text-text-secondary border border-gray-200 hover:border-primary hover:text-primary"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { useRestaurantFilterOptions } from "@/hooks/public/useRestaurants";
import { useEffect, useState } from "react";

type FilterOption = {
  name: string;
  count?: number;
};

export function RestaurantFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: filterOptions, isLoading } = useRestaurantFilterOptions();

  const searchQuery = searchParams.get("search") ?? "";
  const selectedCities = searchParams.getAll("city");
  const selectedCuisines = searchParams.getAll("cuisine");
  const onlyOpen = searchParams.get("onlyOpen") === "true";

  const [searchInput, setSearchInput] = useState(searchQuery);

  const cities = filterOptions?.cities ?? [];
  const cuisines = filterOptions?.cuisines ?? [];

  const toggleArrayParam = (key: "city" | "cuisine", value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(key);

    params.delete(key);

    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    for (const nextValue of nextValues) {
      params.append(key, nextValue);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const toggleOnlyOpen = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set("onlyOpen", "true");
    } else {
      params.delete("onlyOpen");
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("search");
    params.delete("city");
    params.delete("cuisine");
    params.delete("onlyOpen");
    params.set("page", "1");

    setSearchParams(params);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCities.length > 0 ||
    selectedCuisines.length > 0 ||
    onlyOpen;

  useEffect(() => {
    requestAnimationFrame(() => {
      setSearchInput(searchQuery);
    });
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const nextSearchValue = searchInput.trim();

      const currentSearchValue = params.get("search") ?? "";

      if (nextSearchValue === currentSearchValue) return;

      if (nextSearchValue) {
        params.set("search", nextSearchValue);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      setSearchParams(params);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput, searchParams, setSearchParams]);

  return (
    <section
      className="space-y-5 border-b border-border pb-6"
      aria-label="Restaurant filters"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search restaurants</span>

          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by restaurant, cuisine, or location"
            className="h-10 pl-9"
          />
        </label>

        <div className="flex items-center gap-3">
          <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(event) => toggleOnlyOpen(event.target.checked)}
              className="size-4 accent-primary"
            />
            <SlidersHorizontal
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Open now
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      <FilterGroup
        title="Cities"
        isLoading={isLoading}
        options={cities}
        selectedValues={selectedCities}
        onToggle={(city) => toggleArrayParam("city", city)}
      />

      <FilterGroup
        title="Cuisines"
        isLoading={isLoading}
        options={cuisines}
        selectedValues={selectedCuisines}
        onToggle={(cuisine) => toggleArrayParam("cuisine", cuisine)}
      />
    </section>
  );
}

type FilterGroupProps = {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  isLoading: boolean;
  onToggle: (value: string) => void;
};

function FilterGroup({
  title,
  options,
  selectedValues,
  isLoading,
  onToggle,
}: FilterGroupProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{title}</p>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.name);

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onToggle(option.name)}
              className={`h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {option.name}
              {typeof option.count === "number" && (
                <span className="ml-1 opacity-75">({option.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

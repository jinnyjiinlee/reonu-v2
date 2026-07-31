"use client";

import { createContext, useContext, useState } from "react";
import type { Filter } from "@/data/works";

interface FilterContextValue {
  filter: Filter;
  setFilter: (f: Filter) => void;
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView]     = useState<"grid" | "list">("grid");
  return (
    <FilterContext.Provider value={{ filter, setFilter, view, setView }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterCtx() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilterCtx must be used inside FilterProvider");
  return ctx;
}

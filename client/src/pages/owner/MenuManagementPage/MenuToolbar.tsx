import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

type MenuStatus = "all" | "available" | "out-of-stock";

const SEARCH_PARAM = "search";
const STATUS_PARAM = "status";

export function MenuToolbar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFromUrl = searchParams.get(SEARCH_PARAM) ?? "";
  const statusFromUrl =
    (searchParams.get(STATUS_PARAM) as MenuStatus | null) ?? "all";

  const [search, setSearch] = useState(searchFromUrl);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      params.set(SEARCH_PARAM, debouncedSearch.trim());
    } else {
      params.delete(SEARCH_PARAM);
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const handleStatusChange = (status: MenuStatus | null) => {
    const params = new URLSearchParams(searchParams);

    if (!status || status === "all") {
      params.delete(STATUS_PARAM);
    } else {
      params.set(STATUS_PARAM, status);
    }

    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search item name or description..."
            className="h-11 rounded-full pl-11"
          />
        </div>

        <Button variant="outline" size="icon" className="size-11 rounded-full">
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>

      <Select value={statusFromUrl} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-10 w-full rounded-full sm:w-44">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

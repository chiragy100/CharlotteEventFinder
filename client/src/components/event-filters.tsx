import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface EventFiltersProps {
  filters: {
    search: string;
    startDate?: Date;
    endDate?: Date;
    radius: number;
    isFree?: boolean;
    isFamilyFriendly?: boolean;
    isOutdoor?: boolean;
    verifiedOnly?: boolean;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function EventFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: EventFiltersProps) {
  const activeFilterCount = [
    filters.startDate,
    filters.endDate,
    filters.isFree,
    filters.isFamilyFriendly,
    filters.isOutdoor,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Events</Label>
          <Input
            id="search"
            type="search"
            placeholder="Search by title or location..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            data-testid="input-search"
          />
        </div>

        <div className="space-y-2">
          <Label>Radius: {filters.radius} miles</Label>
          <Slider
            value={[filters.radius]}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, radius: value })
            }
            min={1}
            max={10}
            step={0.5}
            className="w-full"
            data-testid="slider-radius"
          />
        </div>

        <div className="space-y-3">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-start-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? (
                    format(filters.startDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) =>
                    onFiltersChange({ ...filters, startDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-end-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? (
                    format(filters.endDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">End date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) =>
                    onFiltersChange({ ...filters, endDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Event Type</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="free" className="font-normal cursor-pointer">
                Free Events Only
              </Label>
              <Switch
                id="free"
                checked={filters.isFree || false}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, isFree: checked || undefined })
                }
                data-testid="switch-free"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="family"
                className="font-normal cursor-pointer"
              >
                Family-Friendly
              </Label>
              <Switch
                id="family"
                checked={filters.isFamilyFriendly || false}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    isFamilyFriendly: checked || undefined,
                  })
                }
                data-testid="switch-family-friendly"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="outdoor"
                className="font-normal cursor-pointer"
              >
                Outdoor Events
              </Label>
              <Switch
                id="outdoor"
                checked={filters.isOutdoor || false}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    isOutdoor: checked || undefined,
                  })
                }
                data-testid="switch-outdoor"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="verified"
                className="font-normal cursor-pointer"
              >
                Verified Only
              </Label>
              <Switch
                id="verified"
                checked={filters.verifiedOnly || false}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    verifiedOnly: checked || undefined,
                  })
                }
                data-testid="switch-verified-only"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectDropdownProps {
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  triggerClassName?: string;
  onSearch?: (query: string) => Promise<void>;
  searching?: boolean;
  searchMinLength?: number;
}

export default function SearchableSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  triggerClassName,
  onSearch,
  searching = false,
  searchMinLength = 0,
}: SearchableSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLabelOverride, setSelectedLabelOverride] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchText, 300);
  const isServerMode = typeof onSearch === "function";
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const onSearchRef = useRef(onSearch);

  useLayoutEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    const element = triggerRef.current;
    if (!element) return;

    const measure = () => setTriggerWidth(element.getBoundingClientRect().width);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isServerMode) return;
    if (!open) return;
    if (debouncedSearch.length < searchMinLength) return;
    onSearchRef.current?.(debouncedSearch);
  }, [debouncedSearch, isServerMode, open, searchMinLength]);

  useEffect(() => {
    if (!open && searchText !== "") {
      setSearchText("");
    }
  }, [open, searchText]);

  useEffect(() => {
    if (value && selectedLabelOverride === null) {
      const match = options.find((o) => o.value === value);
      if (match) {
        setSelectedLabelOverride(match.label);
      }
    }
    if (!value) {
      setSelectedLabelOverride(null);
    }
  }, [value, options, selectedLabelOverride]);

  const selectedLabel = useMemo(() => {
    if (selectedLabelOverride) return selectedLabelOverride;
    if (!value) return placeholder;
    return options.find((o) => o.value === value)?.label ?? placeholder;
  }, [selectedLabelOverride, value, options, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full min-w-0 justify-between gap-2 overflow-hidden font-normal",
              !value && "text-muted-foreground",
              triggerClassName,
            )}
            title={selectedLabel}
          />
        }
      >
        <span className="min-w-0 flex-1 truncate text-left">{selectedLabel}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        sideOffset={2}
        collisionPadding={8}
        style={{ minWidth: triggerWidth > 0 ? `${triggerWidth}px` : undefined }}
      >
        <Command shouldFilter={!isServerMode}>
          <div className="flex items-center border-b">
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchText}
              onValueChange={setSearchText}
            />
            {searching && (
              <Loader2 className="text-muted-foreground mr-3 h-4 w-4 shrink-0 animate-spin" />
            )}
          </div>
          <CommandList className="custom-scrollbar">
            {searching && options.length === 0 ? (
              <div className="text-muted-foreground flex min-h-16 items-center justify-center py-6 text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => {
                      if (option.disabled) return;
                      setSelectedLabelOverride(option.label);
                      onChange(option.value);
                      setOpen(false);
                      setSearchText("");
                    }}
                    className={cn(option.disabled && "cursor-not-allowed opacity-50")}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate" title={option.label}>
                      {option.label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";

interface AuditLogFiltersProps {
  search: string;
  actionFilter: string;
  entityTypeFilter: string;
  statusFilter: string;
  actions: string[];
  entityTypes: string[];
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

export default function AuditLogFilters({
  search,
  actionFilter,
  entityTypeFilter,
  statusFilter,
  actions,
  entityTypes,
  dateFrom,
  dateTo,
  onSearchChange,
  onActionChange,
  onEntityTypeChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
}: AuditLogFiltersProps) {
  const actionOptions = [
    { value: "", label: "All Actions" },
    ...actions.map((a) => ({ value: a, label: a })),
  ];

  const entityTypeOptions = [
    { value: "", label: "All Types" },
    ...entityTypes.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search logs..."
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <SearchableSelectDropdown
        options={actionOptions}
        value={actionFilter}
        onChange={onActionChange}
        placeholder="All Actions"
        searchPlaceholder="Filter actions..."
        emptyMessage="No actions found."
        triggerClassName="h-9 w-auto min-w-[180px]"
      />

      <SearchableSelectDropdown
        options={entityTypeOptions}
        value={entityTypeFilter}
        onChange={onEntityTypeChange}
        placeholder="All Types"
        searchPlaceholder="Filter entity types..."
        emptyMessage="No types found."
        triggerClassName="h-9 w-auto min-w-[160px]"
      />

      <SearchableSelectDropdown
        options={statusOptions}
        value={statusFilter}
        onChange={onStatusChange}
        placeholder="All Status"
        searchPlaceholder="Filter status..."
        emptyMessage="No status found."
        triggerClassName="h-9 w-auto min-w-[140px]"
      />

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="bg-background h-9 rounded-md border px-3 text-sm"
          title="From date"
        />
        <span className="text-muted-foreground text-sm">&ndash;</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="bg-background h-9 rounded-md border px-3 text-sm"
          title="To date"
        />
      </div>
    </div>
  );
}

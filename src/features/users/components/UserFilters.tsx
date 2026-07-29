import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";

interface UserFiltersProps {
  search: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "educator", label: "Educator" },
  { value: "admin", label: "Admin" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Disabled" },
];

export default function UserFilters({
  search,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <SearchableSelectDropdown
        options={roleOptions}
        value={roleFilter}
        onChange={onRoleChange}
        placeholder="All Roles"
        searchPlaceholder="Filter roles..."
        emptyMessage="No roles found."
        triggerClassName="h-9 w-auto min-w-[140px]"
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
    </div>
  );
}

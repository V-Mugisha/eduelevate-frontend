import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or topic..."
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <Button onClick={onSearch} disabled={isLoading}>
        <Search className="size-4" />
      </Button>
    </div>
  );
}

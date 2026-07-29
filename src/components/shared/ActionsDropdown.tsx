import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DropdownAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface ActionsDropdownProps {
  actions: DropdownAction[];
}

export default function ActionsDropdown({ actions }: ActionsDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Actions" />}>
        <EllipsisVertical className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
              action.destructive
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

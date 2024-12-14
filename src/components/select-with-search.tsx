"use client";
import React, { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function SelectWithSearch() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "date", label: "Date" },
    { value: "grape", label: "Grape" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {selected
            ? items.find((item) => item.value === selected)?.label
            : "Select an item"}
          <span className="ml-2">&#x25BC;</span> {/* Down arrow */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-[200px]">
        <Command>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    setSelected(item.value);
                    setOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

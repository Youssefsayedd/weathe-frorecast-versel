import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import data from "../countries.json";


export const IMenuItem = {
  label: "",
  value: "",
  items: [],
};

const DropdownMenuItemComponent = ({
  item,
  onSelect,
  isSelected,
  isParentOfSelected,
  selectedPath,
}) => {
  const [isOpen, setIsOpen] = useState(isParentOfSelected);

  const handleItemClick = () => {
    onSelect(item.value);
    if (!item.items) {
      setIsOpen(false);
    }
  };

  if (item.items) {
    return (
      <DropdownMenuSub open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuSubTrigger
          className={cn(
            "flex items-center justify-between",
            (isSelected || isParentOfSelected) && "bg-accent"
          )}
          onClick={handleItemClick}
        >
          <span>{item.label}</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {item.items.map((subItem, index) => (
              <DropdownMenuItemComponent
                key={index}
                item={subItem}
                onSelect={onSelect}
                isSelected={selectedPath.includes(subItem.value)}
                isParentOfSelected={
                  selectedPath.includes(subItem.value) &&
                  subItem.items !== undefined
                }
                selectedPath={selectedPath}
              />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem
      onClick={handleItemClick}
      className={cn(isSelected && "bg-accent")}
    >
      {item.label}
    </DropdownMenuItem>
  );
};

export default function MultiLevelDropdown({
  items,
  onSelect,
  defaultValue,
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [selectedPath, setSelectedPath] = useState(
    defaultValue ? [defaultValue] : []
  );

  const handleSelect = (value) => {
    setSelectedValue(value);
    const newPath = findPath(value, items);
    setSelectedPath(newPath);
    onSelect(value);
  };

  const findPath = (value, items, currentPath = []) => {
    for (const item of items) {
      if (item.value === value) {
        return [...currentPath, item.value];
      }
      if (item.items) {
        const path = findPath(value, item.items, [...currentPath, item.value]);
        if (path.length > 0) {
          return path;
        }
      }
    }
    return [];
  };

  const findLabel = (value, items) => {
    for (const item of items) {
      if (item.value === value) return item.label;
      if (item.items) {
        const label = findLabel(value, item.items);
        if (label) return label;
      }
    }
    return "Select an option";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {findLabel(selectedValue, items)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {items.map((item, index) => (
          <DropdownMenuItemComponent
            key={index}
            item={item}
            onSelect={handleSelect}
            isSelected={selectedPath.includes(item.value)}
            isParentOfSelected={
              selectedPath.includes(item.value) && item.items !== undefined
            }
            selectedPath={selectedPath}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Example usage
const exampleItems = [
  { label: "Home", value: "home" },
  {
    label: "Products",
    value: "products",
    items: [
      { label: "Category 1", value: "category1" },
      {
        label: "Category 2",
        value: "category2",
        items: [
          { label: "Subcategory 1", value: "subcategory1" },
          { label: "Subcategory 2", value: "subcategory2" },
        ],
      },
    ],
  },
  { label: "About", value: "about" },
  {
    label: "Services",
    value: "services",
    items: [
      { label: "Service 1", value: "service1" },
      { label: "Service 2", value: "service2" },
    ],
  },
];

export function Component() {
  const handleSelect = (value) => {
    console.log("Selected:", value);
  };

  return (
    <div className="p-4">
      <MultiLevelDropdown
        items={exampleItems}
        onSelect={handleSelect}
        defaultValue="home"
      />
    </div>
  );
}



const els = data.map(parent => {
  return {
    ...parent,
    label : parent.name,
    value: parent.name,
    items: parent.states?.map(child=>({
      ...child,
      label : child.name,
      value : child.name,
    }))
  }

})

export function Appsss() {
  const handleSelect = value => {
    let obj ;

    obj = els.find(el => el.value = value)
    if (!obj)
      obj = els.find(el => el.items.find(el=>el.value = value))

    console.log(obj)
  };
  return <div className="App">
    <MultiLevelDropdown
        items={els}
        onSelect={handleSelect}
        defaultValue="home"
      />
  </div>;
}

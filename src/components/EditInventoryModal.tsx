"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import type { InventoryItem } from "@/types";

type Props = {
  item: InventoryItem;
  onClose: () => void;
  onSave: (updatedItem: InventoryItem) => void;
};

const predefinedUnits = [
  "jar",
  "can",
  "bottle",
  "dozen",
  "box",
  "pack",
  "lb",
  "oz",
  "g",
  "kg",
  "cup",
  "tsp",
  "tbsp",
];


  
const predefinedLocations = [
  "snack cabinet",
  "left of oven cabinet",
  "long counter cabinet 1",
  "long counter cabinet 2",
  "long counter cabinet 3",
  "baking cabinet",
  "noodle cabinet",
  "spice cabinet",
  "can cabinet",
  "pantry",
  "drawer 1",
  "drawer 2",
  "drawer 3",
  "drawer 4",
  "drawer 5",
  "drawer 6",
  "kitchen fridge",
  "kitchen freezer",
  "garage fridge freezer",
  "garage fridge",
  "garage large freezer",
];

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    borderColor: "hsl(var(--border))",
    boxShadow: "none",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    border: "1px solid hsl(var(--border))",
  }),
  option: (base: any, { isFocused, isSelected }: any) => ({
    ...base,
    backgroundColor: isSelected
      ? "hsl(var(--primary))"
      : isFocused
      ? "hsl(var(--muted))"
      : "hsl(var(--background))",
    color: isSelected
      ? "hsl(var(--primary-foreground))"
      : "hsl(var(--foreground))",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "hsl(var(--foreground))",
  }),
  input: (base: any) => ({
    ...base,
    color: "hsl(var(--foreground))",
  }),
};

export default function EditInventoryModal({ item, onClose, onSave }: Props) {
  const [formState, setFormState] = useState<InventoryItem>(item);
  const [customUnits, setCustomUnits] = useState<string[]>([]);
  const [customLocations, setCustomLocations] = useState<string[]>([]);

  useEffect(() => {
    setFormState(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  const unitOptions = [...predefinedUnits, ...customUnits].map((u) => ({
    value: u,
    label: u,
  }));
  const locationOptions = [...predefinedLocations, ...customLocations].map(
    (loc) => ({
      value: loc,
      label: loc,
    })
  );

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-[hsl(var(--modal)/0.75)] text-modal-foreground p-8 rounded-2xl shadow-lg border border-border w-full max-w-xl backdrop-saturate-150">
        <h3 className="text-xl font-semibold mb-6">Edit Item</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {["name", "brand", "category", "notes"].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label
                htmlFor={field}
                className="text-sm font-medium capitalize text-muted-foreground"
              >
                {field}
              </label>
              <input
                id={field}
                name={field}
                value={formState[field as keyof InventoryItem] ?? ""}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm placeholder:text-muted-foreground transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          ))}

          {/* Quantity, LowThreshold, Unit grouped row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="productSize"
                className="text-sm font-medium capitalize text-muted-foreground"
              >
                Product Size
              </label>
              <input
                id="productSize"
                name="productSize"
                value={formState.productSize ?? ""}
                onChange={handleChange}
                placeholder="e.g. 32oz bag"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm placeholder:text-muted-foreground transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="quantityAvailable"
                className="text-sm font-medium capitalize text-muted-foreground"
              >
                Quantity On Hand
              </label>
              <input
                id="quantityAvailable"
                name="quantityAvailable"
                value={formState.quantityAvailable ?? ""}
                onChange={handleChange}
                placeholder="e.g. 1/2"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm placeholder:text-muted-foreground transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="unit"
                className="text-sm font-medium capitalize text-muted-foreground"
              >
                Unit
              </label>
              <Select
                placeholder="Unit"
                options={unitOptions}
                onChange={(option) => {
                  if (
                    option?.value &&
                    !predefinedUnits.includes(option.value)
                  ) {
                    setCustomUnits((prev) => [...prev, option.value]);
                  }
                  setFormState((prev) => ({
                    ...prev,
                    unit: option?.value || "",
                  }));
                }}
                value={
                  formState.unit
                    ? { value: formState.unit, label: formState.unit }
                    : null
                }
                isClearable
                styles={customSelectStyles}
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="location"
              className="text-sm font-medium capitalize text-muted-foreground"
            >
              Location
            </label>
            <Select
              placeholder="Select or type location"
              options={locationOptions}
              onChange={(option) => {
                if (
                  option?.value &&
                  !predefinedLocations.includes(option.value)
                ) {
                  setCustomLocations((prev) => [...prev, option.value]);
                }
                setFormState((prev) => ({
                  ...prev,
                  location: option?.value || "",
                }));
              }}
              value={
                formState.location
                  ? { value: formState.location, label: formState.location }
                  : null
              }
              isClearable
              styles={customSelectStyles}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

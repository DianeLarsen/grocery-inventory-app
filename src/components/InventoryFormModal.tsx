"use client";

import { useState, useEffect } from "react";
import TypedSelect, { SelectOption } from "@/components/TypedSelect";
import type { InventoryItem } from "@/types";

export type InventoryFormProps = {
  initialItem?: Partial<InventoryItem>;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  title?: string;
  isSaving?: boolean;
  isModal?: boolean;
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

const commonCategories = [
  "vegetable",
  "fruit",
  "soup",
  "cereal",
  "pasta",
  "rice",
  "meat",
  "dairy",
  "frozen",
  "spices",
  "baking",
  "condiments",
  "sauces",
  "beverages",
  "snacks",
  "bread",
  "canned goods",
  "cleaning",
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
const recommendedDecrement = (unit: string): string => {
  const lower = unit.toLowerCase();
  if (["can", "loaf", "each", "slice", "head"].includes(lower)) return "1";
  if (["bag", "box", "carton"].includes(lower)) return "0.25";
  if (["jar", "bottle", "tub", "container"].includes(lower)) return "0.1";
  return "1";
};

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

export default function InventoryFormModal({
  initialItem = {},
  onClose,
  onSave,
  title = "Add or Edit Item",
  isSaving = false,
  isModal = true,
}: InventoryFormProps) {
  const [form, setForm] = useState<Partial<InventoryItem>>(initialItem);

  useEffect(() => {
    setForm(initialItem);
  }, [initialItem]);
function isMissing(field: keyof InventoryItem) {
  const val = form[field];
  return !val || val.toString().trim() === "";
}


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const unitOptions = predefinedUnits.map((u) => ({ value: u, label: u }));
  const locationOptions = predefinedLocations.map((l) => ({
    value: l,
    label: l,
  }));
  const categoryOptions = commonCategories.map((c) => ({ value: c, label: c }));

  const Wrapper = isModal ? "div" : "section";
  const wrapperProps = isModal
    ? {
        className:
          "fixed inset-0 bg-background/70 backdrop-blur-md flex justify-center items-center z-50",
      }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={`bg-[hsl(var(--modal)/0.9)] p-6 rounded-2xl shadow-lg w-full max-w-xl ${
          isModal ? "border border-border" : ""
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {["name", "brand", "notes"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field as keyof InventoryItem] ?? ""}
              onChange={handleChange}
              placeholder={field}
              className={`border p-2 rounded w-full ${
    isMissing("name") ? "border-red-500 ring-1 ring-red-300" : ""
  }`}
            />
          ))}

          <TypedSelect
            placeholder="Category"
            options={categoryOptions}
            onChange={(selectedOption: SelectOption | null) =>
              setForm((prev) => ({
                ...prev,
                category: selectedOption?.value || "",
              }))
            }
            value={
              form.category
                ? { value: form.category, label: form.category }
                : null
            }
            styles={customSelectStyles}
            isClearable
          />

          <input
            name="productSize"
            value={form.productSize ?? ""}
            onChange={handleChange}
            placeholder="Product size (e.g. 32oz box)"
            className={`border p-2 rounded w-full ${
    isMissing("name") ? "border-red-500 ring-1 ring-red-300" : ""
  }`}
          />

          <input
            name="quantityAvailable"
            value={form.quantityAvailable ?? ""}
            onChange={handleChange}
            placeholder="Quantity (e.g. 1, 1/2)"
            className={`border p-2 rounded w-full ${
    isMissing("name") ? "border-red-500 ring-1 ring-red-300" : ""
  }`}
          />

          <TypedSelect
            placeholder="Unit"
            options={unitOptions}
            onChange={(selectedOption: SelectOption | null) => {
              const value = selectedOption?.value || "";
              setForm((prev) => ({
                ...prev,
                unit: value,
                decrementStep: recommendedDecrement(value),
              }));
            }}
            styles={customSelectStyles}
            isClearable
          />
          <TypedSelect
            placeholder="Decrement Step"
            options={[
              { value: "1", label: "Whole (e.g. can, loaf)" },
              { value: "0.25", label: "Quarter (e.g. bag of chips)" },
              { value: "0.1", label: "Tenth (e.g. bottle of ketchup)" },
            ]}
            onChange={(selectedOption: SelectOption | null) =>
              setForm((prev) => ({
                ...prev,
                decrementStep: selectedOption?.value || "",
              }))
            }
            value={
              form.decrementStep
                ? {
                    value: form.decrementStep,
                    label:
                      form.decrementStep === "1"
                        ? "Whole (e.g. can, loaf)"
                        : form.decrementStep === "0.25"
                        ? "Quarter (e.g. bag of chips)"
                        : "Tenth (e.g. bottle of ketchup)",
                  }
                : null
            }
            styles={customSelectStyles}
            isClearable
          />

          <TypedSelect
            placeholder="Location"
            options={locationOptions}
            onChange={(selectedOption: SelectOption | null) =>
              setForm((prev) => ({
                ...prev,
                location: selectedOption?.value || "",
              }))
            }
            value={
              form.location
                ? { value: form.location, label: form.location }
                : null
            }
            styles={customSelectStyles}
            isClearable
          />

          <textarea
            name="notes"
            value={form.notes ?? ""}
            onChange={handleChange}
            placeholder="Notes"
            className={`border p-2 rounded w-full ${
    isMissing("name") ? "border-red-500 ring-1 ring-red-300" : ""
  }`}
          />

          <div className="flex justify-end gap-2 mt-4">
            {isModal && (
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            )}
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}

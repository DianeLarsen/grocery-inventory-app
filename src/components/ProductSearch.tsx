"use client";

import { useState } from "react";
import { searchProductAction } from "@/lib/actions/searchProductAction";
import Fuse from "fuse.js";
import Link from "next/link";
import Select from "react-select";

type ProductResult = {
  upc: string;
  name: string;
  category?: string;
  brandOwner?: string;
  brand?: string;
  quantity?: string;
  imageUrl?: string;
  url?: string;
};

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [availableBrands, setAvailableBrands] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [limit, setLimit] = useState(10);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("query", query);
    formData.append("brand", brand);
    formData.append("barcode", barcode);
    formData.append("limit", limit.toString());

    const data = await searchProductAction(formData);

    // ✅ Set results BEFORE filtering/slicing
    setResults(data);

    // ✅ Use full result set for brand suggestions
    const uniqueBrands = Array.from(
      new Set(data.map((item) => item.brand?.trim()).filter(Boolean))
    );
    setAvailableBrands(uniqueBrands);
    const formattedBrands = uniqueBrands.map((b) => ({
      value: b,
      label: b,
    }));
    setAvailableBrands(formattedBrands);

    setSelectedBrand("");

    setResults(data);
    setLoading(false);
  };
  const handleAddToInventory = async (item: ProductResult) => {
    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
  
      if (!res.ok) throw new Error("Failed to add item");
  
      // Optional: Toast or UI feedback
      console.log("✅ Item added:", item.name);
    } catch (err) {
      console.error("❌ Add to inventory failed:", err);
    }
  };
  
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <div className="flex flex-col gap-4 md:flex-row">
  <input
    type="text"
    name="query"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search by name or description"
    className="border p-2 rounded w-full"
  />

  <div className="relative w-full md:w-1/3">
    <Select
      options={availableBrands}
      value={availableBrands.find((b) => b.value === selectedBrand) || null}
      onChange={(selectedOption) => {
        setSelectedBrand(selectedOption?.value || "");
      }}
      isClearable
      placeholder="Select a brand..."
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))",
          boxShadow: "none",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid hsl(var(--border))",
        }),
        option: (base, { isFocused, isSelected }) => ({
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
        singleValue: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
        input: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
      }}
      classNamePrefix="react-select"
    />
  </div>

  <input
    type="text"
    name="barcode"
    value={barcode}
    onChange={(e) => setBarcode(e.target.value)}
    placeholder="Barcode (optional)"
    className="border p-2 rounded w-full md:w-1/3"
  />
</div>

        <div className="flex gap-2 items-center">
          <label htmlFor="limit" className="text-sm">
            Results per page:
          </label>
          <select
            id="limit"
            name="limit"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="ml-auto bg-primary text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-orange-500 font-medium mb-2">🔍 Searching...</p>
      )}

      {results && (
        <p className="text-sm text-muted-foreground mt-1">
          Showing{" "}
          {Math.min(
            limit,
            results.filter((item) =>
              selectedBrand
                ? item.brand?.toLowerCase() === selectedBrand.toLowerCase()
                : true
            ).length
          )}{" "}
          of {results.length} total results
        </p>
      )}

      <div className="overflow-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">UPC</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Brand Owner</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Size</th>
            </tr>
          </thead>
          <tbody>
            {results &&
              results
                .filter((item) =>
                  selectedBrand
                    ? item.brand?.toLowerCase() === selectedBrand.toLowerCase()
                    : true
                )
                .slice(0, limit)
                .map((item) => (
                  <tr key={item.upc}>
                    <td className="p-2 border">{item.upc}</td>
                    <td className="p-2 border">
                      {item.url ? (
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="p-2 border">{item.category}</td>
                    <td className="p-2 border">{item.brandOwner}</td>
                    <td className="p-2 border">{item.brand}</td>
                    <td className="p-2 border">{item.quantity || "—"}</td>
                    <td className="p-2 border">
    <button
      onClick={() => handleAddToInventory(item)}
      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
    >
      + Add
    </button>
  </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && results && results.length === 0 && (
          <p className="text-center text-orange-500 font-medium mt-4">
            No results found. Please check your spelling and try again.
          </p>
        )}
      </div>
    </div>
  );
}

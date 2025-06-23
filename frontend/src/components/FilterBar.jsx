// components/FilterBar.jsx
import React from "react";

const categories = [
  "All",
  "Technology",
  "Health",
  "DSA",
  "SQL",
  "Backend",
  "Frontend",
];

const FilterBar = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full border ${
            selected === cat ? "bg-blue-600 text-white" : "bg-white text-black"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;

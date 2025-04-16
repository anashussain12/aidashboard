"use client";
import React from "react";
// import PropTypes from "pro";
import { FaSearch } from "react-icons/fa";

const categories = ["All", "Text", "Image", "Chatbots", "Code", "Video"];

const SearchBar = ({
  searchValue,
  onSearchChange,
  onClearSearch,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 mb-12">
      {/* Search Input */}
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          placeholder="Type to search for over 1500+ tools..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 pl-12 pr-14 rounded-full border border-gray-700 bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9901bf]" size={20} />
        {searchValue && (
          <button
            onClick={onClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg"
          >
            ×
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => onCategoryChange(filter)}
            className={`px-4 py-2 rounded-full border text-sm font-medium shadow-md transition ${
              activeCategory === filter
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-800 text-white border-gray-600 hover:bg-blue-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};


export default SearchBar;

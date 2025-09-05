

import React from 'react';
import { BsChevronDown } from 'react-icons/bs';

const FilterBar = ({ language, setLanguage, sort, setSort }) => {
  return (
    <div className="flex flex-row sm:flex-row gap-4 mb-8 w-full max-w-2xl mx-auto">
      {/* Language Filter */}
      <div className="relative w-full sm:w-auto flex-1 group">
        <select
          className="w-full appearance-none p-3 rounded-lg border border-gray-300 bg-white text-gray-800 pr-10
                     cursor-pointer shadow-sm outline-none "
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="TypeScript">TypeScript</option>
          <option value="C#">C#</option>
          <option value="C++">C++</option>
          <option value="Go">Go</option>
          <option value="Rust">Rust</option>
          <option value="PHP">PHP</option>
          <option value="Ruby">Ruby</option>
          <option value="Swift">Swift</option>
          <option value="Kotlin">Kotlin</option>
        </select>
        <BsChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:rotate-180"
        />
      </div>

      {/* Sort Filter */}
      <div className="relative w-full sm:w-auto flex-1 group">
        <select
          className="w-full appearance-none p-3 rounded-lg border border-gray-300 bg-white text-gray-800 pr-10
                     cursor-pointer shadow-sm outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="stars">Most Stars</option>
          <option value="updated">Recently Updated</option>
        </select>
        <BsChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:rotate-180"
        />
      </div>
    </div>
  );
};

export default FilterBar;

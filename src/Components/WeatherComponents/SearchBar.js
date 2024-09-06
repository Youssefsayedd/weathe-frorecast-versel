import React from 'react';

function SearchBar({ states, selectedState, onStateSelect, searchQuery, onSearchQueryChange, onSearch, onKeyPress }) {
  return (
    <div className="flex justify-center rounded-l-lg mb-8">
      <select
        value={selectedState}
        onChange={onStateSelect}
        className="rounded-l-lg bg-white bg-opacity-20 text-white focus:outline-none"
      >
        <option value="">Select City</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.name} className='text-black'>
            {state.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search for a city "
        value={searchQuery}
        onChange={onSearchQueryChange}
        onKeyPress={onKeyPress}
        className="px-4 py-2 bg-white bg-opacity-20 text-white placeholder-white focus:outline-none"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2 rounded-r-lg bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:outline-none"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
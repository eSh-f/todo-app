import React, { useState } from 'react';

const Search = ({ tasks, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const results = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toString().includes(searchQuery)
    );
    onSearch(results);
  };

  return (
    <div className='search-container'>
      <input
        className='search-input'
        type='text'
        placeholder='Поиск задач...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className='search-button' onClick={handleSearch}>
        Найти
      </button>
    </div>
  );
};

export default Search;

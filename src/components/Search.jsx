import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { Box } from '@mui/material';

const Search = ({ searchQuery, onSearch, setSearchQuery, resetSearch }) => {
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === '') {
      resetSearch();
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      resetSearch();
      return;
    }
    onSearch(searchQuery);
  };

  return (
    <Box>
      <TextField
        sx={{
          backgroundColor: 'white',
          borderRadius: '5px',
          '& .MuiInputBase-root': {
            height: '36px', // Устанавливаем высоту самого поля
          },
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 7px) scale(1)', // Лейбл ниже
          },
          '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -4px) scale(0.75)', // Лейбл при фокусе
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '5px', // Радиус границы
          },
        }}
        label='Поиск'
        variant='outlined'
        type='search'
        placeholder='Введите задачу...'
        value={searchQuery}
        onChange={handleInputChange}
        onInput={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </Box>
  );
};

export default Search;

import React from 'react';
import { TextField } from '@mui/material';
import './Search.css';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      label="Search Widgets"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  );
};

export default Search;
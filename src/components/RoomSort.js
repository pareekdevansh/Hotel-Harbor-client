import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function RoomSort({ sortType, onSort }) {
  const handleSortChange = (event) => {
    const selectedSortType = event.target.value;
    onSort(selectedSortType);
  };

  return (
    <FormControl variant="outlined">
      <InputLabel id="sort-label">Sort by</InputLabel>
      <Select
        labelId="sort-label"
        id="sort-select"
        value={sortType}
        onChange={handleSortChange}
        label="Sort by"
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="nameAsc">Name: A-Z</MenuItem>
        <MenuItem value="nameDesc">Name: Z-A</MenuItem>
        <MenuItem value="priceAsc">Price: Low to High</MenuItem>
        <MenuItem value="priceDesc">Price: High to Low</MenuItem>
        <MenuItem value="ratingDesc">Customer Rating: High to Low</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoomSort;

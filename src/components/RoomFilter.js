import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Slider,
  Autocomplete,
  Modal,
  Box,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
function RoomFilter({
  query,
  filterMaxCount,
  filterPriceRange,
  filterSelectedTags,
  onMaxCountChange,
  onPriceRangeChange,
  onTagsChange,
  onTextChange,
  onFilter,
  onClear,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const priceRange = [100, 2000];
  const allTags = ["Deluxe", "Economy", "Premium"];
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function applyFilter() {
    // apply the filters and close the modal
    onFilter();
    handleCloseModal();
  }
  function clearFilter() {
    // clear Filters and close the modal
    onClear();
    handleCloseModal();
  }

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Search Rooms"
          variant="outlined"
          value={query}
          fullWidth
          onChange={onTextChange}
          sx={{ width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={handleOpenModal} title="Filter">
          <FilterListIcon />
        </IconButton>
      </Stack>

      <Modal open={isModalOpen} onClose={clearFilter}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <TextField
            label="Max Count"
            type="number"
            value={filterMaxCount}
            onChange={(event) => onMaxCountChange(event.target.value)}
            sx={{ mb: 3 }}
          />
          <Slider
            value={filterPriceRange}
            onChange={onPriceRangeChange}
            valueLabelDisplay="auto"
            step={50}
            marks
            defaultValue={priceRange}
            min={priceRange[0]}
            max={priceRange[1]}
            sx={{ mb: 3 }}
          />
          <Autocomplete
            multiple
            options={allTags}
            value={filterSelectedTags}
            onChange={onTagsChange}
            renderInput={(params) => (
              <TextField {...params} label="Tags" variant="outlined" />
            )}
            sx={{ mb: 3 }}
          />
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained" onClick={clearFilter}>
              Clear Filters
            </Button>
            <Button variant="contained" onClick={applyFilter}>
              Apply Filter
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default RoomFilter;

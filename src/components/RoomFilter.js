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
} from "@mui/material";
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
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // default filter properties
  // this properties will be applied upon clearing filters
  const maxCount = 5;
  const priceRange = [300, 800];
  const allTags = ["Suite", "Deluxe", "Economy"];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function applyFilter() {
    // Apply the filters
    const filters = {
      maxCount: filterMaxCount,
      priceStart: filterPriceRange[0],
      priceEnd: filterPriceRange[1],
      tags: filterSelectedTags,
    };
    console.log(filters);

    // apply the filters and close the modal
    onFilter();
    handleCloseModal();
  }
  function clearFilter() {
    const filters = {
      maxCount: maxCount,
      priceRange: priceRange,
      tags: allTags,
    };
    console.log(filters);
    // clear Filters and close the modal
    onFilter();
    handleCloseModal();
  }

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Search Rooms"
          variant="outlined"
          value={query}
          onChange={onTextChange}
          sx={{ width: "100%" }}
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

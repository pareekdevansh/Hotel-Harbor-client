import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import BasicDatePicker from "../components/Datepicker";
import dayjs from "dayjs";
import RoomFilter from "../components/RoomFilter";
import RoomSort from "../components/RoomSort";
import MenuAppBar from "../components/AppBar";
function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  //  all rooms data
  const [rooms, setRooms] = useState([]);
  // every-time date-range is changed or handle filter is called => change filteredRooms
  const [filteredRooms, setFilteredRooms] = useState([]);

  // filter section will use maxCount , priceRange, tags props to update ui
  const [filterMaxCount, setFilterMaxCount] = useState(6);
  const [filterPriceRange, setFilterPriceRange] = useState([100, 2000]);
  const [filterSelectedTags, setFilterSelectedTags] = useState([]);
  const [sortType, setSortType] = useState("");

  // handleFilter will always listen to these props
  // these props should only change upon pressing apply filters or clear filters
  const [onFilterMaxCount, setOnFilterMaxCount] = useState(6);
  const [onFilterPriceRange, setOnFilterPriceRange] = useState([100, 2000]);
  const [onFilterSelectedTags, setOnFilterSelectedTags] = useState([]);

  // to keep track of query typed in search textfield
  const [query, setQuery] = useState("");
  const handleMaxCountChange = (value) => {
    if (value >= 1) {
      setFilterMaxCount(value);
    }
  };
  const handlePriceRangeChange = (event, newValue) => {
    setFilterPriceRange(newValue);
  };
  const handleTagsChange = (event, newValue) => {
    setFilterSelectedTags(newValue);
  };

  const onTextChange = (event) => {
    setQuery(event.target.value);
  };

  // !! by default dates selected will be (today , today + 3 days)
  const dateFormat = "DD/MM/YYYY";
  const today = dayjs();
  const threeDaysLater = today.add(3, "day");
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(threeDaysLater);
  const getAllRooms = async () => {
    try {
      const response = await axios.get("/api/rooms/getallrooms");
      console.log("@getAllRooms response[] ", response.data);
      setRooms(response.data);
    } catch (error) {
      setError(true);
      setRooms([]);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRooms();
  }, []);
  async function applyCustomSortingOnRooms(newValue = sortType) {
    setSortType(newValue);
    //value="","nameAsc","nameDesc","priceAsc","priceDesc","ratingDesc
    console.log(`sorting by ${sortType}`);
    const roomsList = Array.from(filteredRooms);
    roomsList.sort((a, b) => {
      console.log(a);
      console.log(b);
      if (sortType === "nameAsc") return a.name.localeCompare(b.name);
      else if (sortType === "nameDesc") return b.name.localeCompare(a.name);
      else if (sortType === "priceAsc") return a.rentPerDay - b.rentPerDay;
      else if (sortType === "priceDesc") return b.rentPerDay - a.rentPerDay;
      // else if (sortType === "ratingDesc") return b.rating - a.rating;
      else return 0;
    });
    setFilteredRooms(roomsList);
    console.log("performed sorting");
  }
  const filterRooms = async () => {
    if (
      checkInDate.isBefore(checkOutDate, "day") ||
      checkInDate.isSame(checkOutDate, "day")
    ) {
      // Apply filters on rooms
      let filteredRoomsList = [];
      console.log("@filterRooms , array used for filtering rooms : ", rooms);
      if (rooms.length) {
        filteredRoomsList = await rooms.filter((room) => {
          let isFiltersMatching =
            room.maxCount <= onFilterMaxCount &&
            room.rentPerDay >= onFilterPriceRange[0] &&
            room.rentPerDay <= onFilterPriceRange[1] &&
            (onFilterSelectedTags.length === 0 ||
              onFilterSelectedTags.includes(room.roomType));
          if (!isFiltersMatching) return false;
          let isQueryMatching =
            query.length === 0 ||
            room.name.toLowerCase().includes(query.toLowerCase());
          if (!isQueryMatching) return false;
          for (const booking of room.currentBookings) {
            const isBefore = checkOutDate.isBefore(booking.checkInDate, "day");
            const isAfter = checkInDate.isAfter(booking.checkOutDate, "day");

            if (!isBefore && !isAfter) {
              console.log(`before ${isBefore}`);
              console.log(`after ${isAfter}`);
              console.log(`${room.name} Room is booked`);
              return false; // Room is unavailable
            }
          }
          console.log(`${room.name} Room is available`);
          return true; // Room is available
        });
        console.log("@filterRooms templist[] : ", filteredRoomsList);
        setFilteredRooms(filteredRoomsList);
        console.log("@filterRooms actual filteredList[] : ", filteredRooms);
      } else {
        setFilteredRooms([]);
        console.log("@filterRooms , roomslist was empty: ");
      }
    } else {
      console.log("filteredRooms is empty");
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log("useEffect with multiple {} : rooms[] : ", rooms);

    filterRooms();
    console.log(
      "Ending useEffect with multiple {}: filteredROoms[]: ",
      filteredRooms
    );
  }, [
    checkInDate,
    checkOutDate,
    rooms,
    onFilterMaxCount,
    onFilterPriceRange,
    onFilterSelectedTags,
    query,
  ]);
  useEffect(() => {
    applyCustomSortingOnRooms();
  }, [sortType]);

  function handleFilter() {
    setOnFilterMaxCount(filterMaxCount);
    setOnFilterPriceRange(filterPriceRange);
    setOnFilterSelectedTags(filterSelectedTags);
  }
  function handleClearFilter() {
    setOnFilterMaxCount(6);
    setOnFilterPriceRange([100, 3000]);
    setOnFilterSelectedTags([]);
  }

  const handleDateChange = (date) => {
    setCheckInDate(date[0]);
    setCheckOutDate(date[1]);
    console.log(date);
  };
  return (
    <Box className="container">
      <Box
        direction={"column"}
        margin={"10px"}
        className="col horizontal-center"
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          <Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              padding={2}
              spacing={2}
              alignItems="baseline"
              sx={{
                "& > :nth-child(1)": {
                  mb: { xs: 0, sm: 0 },
                  mr: { xs: 0, sm: 1 },
                  minWidth: { xs: "75%", sm: "40%" },
                },
                "& > :nth-child(2)": {
                  minWidth: { xs: "75%", sm: "40%" },
                },
                "& > :nth-child(3)": {
                  ml: { xs: 0, sm: 0 },
                  minWidth: { xs: "75%", sm: "20%" },
                },
                "& > *": {
                  flex: 1,
                  justifyContent: "center",
                },
              }}
            >
              <BasicDatePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateSelected={handleDateChange}
              />
              <Box>
                <RoomFilter
                  query={query}
                  filterMaxCount={filterMaxCount}
                  filterPriceRange={filterPriceRange}
                  filterSelectedTags={filterSelectedTags}
                  onMaxCountChange={handleMaxCountChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onTagsChange={handleTagsChange}
                  onTextChange={onTextChange}
                  onFilter={handleFilter}
                  onClear={handleClearFilter}
                />
              </Box>
              <RoomSort
                sortType={sortType}
                onSort={(newValue) => {
                  applyCustomSortingOnRooms(newValue);
                }}
              />
            </Stack>

            {filteredRooms?.length > 0 &&
              filteredRooms.map((room) => (
                <div key={room._id} className="col m-4">
                  <Room
                    room={room}
                    fromDate={checkInDate}
                    toDate={checkOutDate}
                  />
                </div>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default HomeScreen;

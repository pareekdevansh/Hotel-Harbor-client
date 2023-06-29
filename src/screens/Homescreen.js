import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import BasicDatePicker from "../components/Datepicker";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import RoomFilter from "../components/RoomFilter";
import RoomSort from "../components/RoomSort";
function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  //  all rooms data
  const [rooms, setRooms] = useState([]);
  // every-time date-range is changed or handle filter is called => change filteredRooms
  const [filteredRooms, setFilteredRooms] = useState([]);

  // filter section will use maxCount , priceRange, tags props to update ui
  const [filterMaxCount, setFilterMaxCount] = useState(5);
  const [filterPriceRange, setFilterPriceRange] = useState([300, 800]);
  const [filterSelectedTags, setFilterSelectedTags] = useState([]);

  // handleFilter will always listen to these props
  // these props should only change upon pressing apply filters or clear filters
  const [onFilterMaxCount, setOnFilterMaxCount] = useState(5);
  const [onFilterPriceRange, setOnFilterPriceRange] = useState([300, 800]);
  const [onFilterSelectedTags, setOnFilterSelectedTags] = useState([]);

  // to keep track of query typed in search textfield
  const [query, setQuery] = useState("");

  const handleMaxCountChange = (value) => {
    if (value >= 2) {
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
    // console.log(JSON.stringify(event));
    setQuery(event.target.value);
  };

  // !! by default dates selected will be (today , today + 3 days)
  const dateFormat = "DD/MM/YYYY";
  const today = dayjs();
  //TODO: later change it to today.add(3 , "day");
  const threeDaysLater = today.add(0, "day");
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(threeDaysLater);

  useEffect(() => {
    getAllRooms();
  }, []);

  // whenever check-in , check-out date changes according to applied filter, filter rooms on basis of date... need to take care of applied filter as well
  useEffect(() => {
    // check CheckInDate <= CheckOutDate
    if (
      checkInDate.isBefore(checkOutDate, "day") ||
      checkInDate.isSame(checkOutDate, "day")
    ) {
      applyFilterOnRooms();

      console.log(`filtered rooms final result : ${filteredRooms}`);
    } else {
      console.log("filteredRooms is empty");
    }
  }, [checkInDate, checkOutDate, rooms]);
  useEffect(() => {
    if (
      checkInDate.isBefore(checkOutDate, "day") ||
      checkInDate.isSame(checkOutDate, "day")
    ) {
      applyFilterOnRooms();
      console.log(`filtered rooms final result : ${filteredRooms}`);
    } else {
      console.log("filteredRooms is empty");
    }
  }, [query, onFilterMaxCount, onFilterPriceRange, onFilterSelectedTags]);

  async function getAllRooms() {
    setLoading(true);
    try {
      await setUser(JSON.parse(localStorage.getItem("currentUser")));
      const data = (await axios.get("/api/rooms/getallrooms")).data;
      console.log(data);
      setRooms(data);
      setError(false);
      setLoading(false);
    } catch (error) {
      setRooms([]);
      setError(true);
      setLoading(false);
      console.log(error);
    }
  }
  async function applyCustomSortingOnRooms(sortType) {
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
    // console.log(
    // `list after sorting on basis of ${sortType} : ${JSON.stringify(
    //     filteredRooms
    //   )}`
    // );
  }
  async function applyFilterOnRooms() {
    try {
      const filteredRoomsList = await rooms.filter((room) => {
        let isQueryMatching =
          query.length === 0 ||
          room.name.toLowerCase().includes(query.toLowerCase());
        if (!isQueryMatching) return false;
        let isFiltersMatching =
          room.maxCount <= onFilterMaxCount &&
          room.rentPerDay >= onFilterPriceRange[0] &&
          room.rentPerDay <= onFilterPriceRange[1] &&
          (onFilterSelectedTags.length === 0 ||
            onFilterSelectedTags.includes(room.roomType));
        if (!isFiltersMatching) return false;
        for (const booking of room.currentBookings) {
          const isBefore = checkOutDate.isBefore(booking.checkInDate, "day");
          const isAfter = checkInDate.isAfter(booking.checkOutDate, "day");

          if (!isBefore && !isAfter) {
            console.log(`before ${isBefore}`);
            console.log(`after ${isAfter}`);
            console.log(`${room.name} Room is unavailable`);
            return false; // Room is unavailable
          }
        }
        console.log(`${room.name} Room is available`);
        return true; // Room is available
      });
      console.log(`filteredRoomsList : ${JSON.stringify(filteredRoomsList)}`);
      setFilteredRooms(filteredRoomsList);
    } catch (error) {
      console.log("error while filtering");
      setFilteredRooms([]);
    }
  }
  async function handleFilter() {
    setOnFilterMaxCount(filterMaxCount);
    setOnFilterPriceRange(filterPriceRange);
    setOnFilterSelectedTags(filterSelectedTags);
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
              spacing={2}
              alignItems="baseline"
              sx={{
                "& > *": {
                  flex: 1,
                  justifyContent: "center",
                },
                "& > *:first-child": {
                  mb: { xs: 1, sm: 0 },
                  mr: { xs: 0, sm: 1 },
                  minWidth: { xs: "75%", sm: "30%" },
                },
                "& > *:nth-child(2)": {
                  minWidth: { xs: "75%", sm: "50%" },
                },
                "& > *:last-child": {
                  ml: { xs: 0, sm: 1 },
                  minWidth: { xs: "75%", sm: "20%" },
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
                />
              </Box>
              <RoomSort
                onSort={(sortType) => applyCustomSortingOnRooms(sortType)}
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

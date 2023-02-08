import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [noOfGuests, setNoOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  let numberofNights = 0;

  if (checkIn && checkOut) {
    numberofNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookPlace() {
    const data = {
      place: place._id,
      checkIn,
      checkOut,
      noOfGuests,
      name,
      email,
      price: numberofNights * place.price,
    };

    try {
      const response = await axios.post("/bookings", data);

      const bookingId = response.data._id;

      setRedirect("/account/bookings/" + bookingId);
    } catch (ex) {
      console.log(ex);
    }
  }

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price : ${place.price} / per night
      </div>
      <div className="border mt-4 rounded-2xl">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in : </label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check Out : </label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests: </label>
          <input
            type="number"
            value={noOfGuests}
            onChange={(ev) => setNoOfGuests(ev.target.value)}
          />
        </div>
        {numberofNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Name: </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />

            <label>Email: </label>
            <input
              type="text"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookPlace} className="primary mt-4">
        Book This place{" "}
        {numberofNights > 0 && (
          <span className="font-bold">
            {" "}
            for ${numberofNights * place.price}
          </span>
        )}
      </button>
    </div>
  );
};

export default BookingWidget;

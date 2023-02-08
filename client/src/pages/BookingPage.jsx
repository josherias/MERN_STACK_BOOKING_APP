import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import BookingDates from "../components/BookingDates";
import LoadingComponent from "../components/LoadingComponent";
import PlaceGallery from "../components/PlaceGallery";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getBooking() {
      setLoading(true);
      if (id) {
        try {
          await axios.get("/bookings").then((response) => {
            const foundBooking = response.data.find(({ _id }) => _id === id);

            if (foundBooking) {
              setBooking(foundBooking);
            }
          });
        } catch (ex) {
          console.log(ex);
        } finally {
          setLoading(false);
        }
      }
    }

    getBooking();
  }, [id]);

  if (loading) return <LoadingComponent />;

  if (!booking) return "";

  return (
    <div className="mt-3 bg-gray-50 -mx-8 px-8 py-8 flex items-center justify-center">
      <div className="w-[100%] md:w-[90%]">
        <h1 className="text-3xl">{booking.place.title}</h1>
        <AddressLink className="my-2 block">
          {booking.place.address}
        </AddressLink>
        <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
          <h2 className="text-xl">Your booking Information</h2>
          <div>
            <BookingDates booking={booking} />
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
};

export default BookingPage;

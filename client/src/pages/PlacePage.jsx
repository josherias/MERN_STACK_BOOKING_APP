import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import BookingWidget from "../components/BookingWidget";
import LoadingComponent from "../components/LoadingComponent";
import PlaceGallery from "../components/PlaceGallery";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPlace() {
      setLoading(true);
      try {
        const { data } = await axios.get("/places/" + id);
        setPlace(data);
      } catch (ex) {
        console.log(ex);
      } finally {
        setLoading(false);
      }
    }

    getPlace();
  }, [id]);

  if (loading) return <LoadingComponent />;

  if (!place) return;

  return (
    <div className="mt-4 bg-gray-50 -mx-8 px-8 py-8 flex items-center justify-center">
      <div className="w-[100%] md:w-[90%]">
        <h1 className="text-3xl">{place.title}</h1>
        <AddressLink>{place.address}</AddressLink>

        <PlaceGallery place={place} />

        <div className="grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] mt-4">
          <div>
            <div className="my-4">
              {" "}
              <h2 className="font-semibold text-2xl mb-2">Description</h2>
              <div className="text-gray-700 font-serif leading-8">
                {place.description}
              </div>
            </div>
            Check-in : {place.checkIn}
            <br />
            Check-out : {place.checkOut}
            <br />
            Max Number of Guests : {place.maxGuests}
          </div>
          <div>
            <BookingWidget place={place} />
          </div>
        </div>

        <div className="py-8">
          <div>
            <h2 className="font-semibold text-2xl mb-2 ">Extra Info</h2>
          </div>
          <div className="mb-4 mt-1 text-sm text-gray-700 font-serif leading-8">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;

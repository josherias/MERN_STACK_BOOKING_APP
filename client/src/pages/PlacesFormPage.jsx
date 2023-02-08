import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import Perks from "../components/Perks";
import PhotosUploader from "../components/PhotosUploader";

const PlacesFormPage = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getPlace = async () => {
      const { data: place } = await axios.get("/places/" + id);

      setTitle(place.title);
      setAddress(place.address);
      setAddedPhotos(place.photos);
      setDescription(place.description);
      setPerks(place.perks);
      setExtraInfo(place.extraInfo);
      setCheckIn(place.checkIn);
      setCheckOut(place.checkOut);
      setMaxGuests(place.maxGuests);
      setPrice(place.price);
    };

    getPlace();
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm my-1">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)} {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      await axios.put("/places", {
        id,
        ...placeData,
      });

      setRedirect(true);
    } else {
      try {
        await axios.post("/places", placeData);
        setRedirect(true);
      } catch (ex) {
        alert(ex);
      }
    }
  }

  if (redirect) return <Navigate to={"/account/places"} />;

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {/* Title */}
        {preInput("Title", "Title should be short and catchy")}
        <input
          type="text"
          placeholder="title, e.g : My lovely Home"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />

        {/* address */}
        {preInput("Address", "Address to this place")}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />

        {/* Photos */}
        {preInput("Photos", "Gets beautify with number")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {/* Description */}
        {preInput("Decription", "Detailed Overview of place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />

        {/* Perks */}
        {preInput("Perks", "Select Perks of your place")}
        <div className="mt-2 grid gap-2 grid-col-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {/* Extra Info */}
        {preInput("Extra Info", "Any additional information that maybe useful")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />

        {/* Checkin checkout */}
        {preInput(
          "Check In & Out times",
          "Check in and out times : remeber to include time period of cleaning"
        )}

        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check In time</h3>
            <input
              type="text"
              placeholder="19:00"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check Out time</h3>
            <input
              type="text"
              placeholder="22:00"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max no of guests</h3>
            <input
              type="number"
              placeholder="4"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              placeholder="100"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>

        <button className="primary my-4">Save Place</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;

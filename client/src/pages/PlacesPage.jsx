import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import LoadingComponent from "../components/LoadingComponent";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPlaces = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/user-places");
        setPlaces(data);
      } catch (ex) {
        console.log(ex);
      } finally {
        setLoading(false);
      }
    };

    getPlaces();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to="/account/places/new"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new Place
        </Link>
      </div>

      {/* places list */}
      <div className="mt-4 flex flex-col gap-2">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              key={place._id}
              className="bg-gray-100 p-4 rounded-2xl flex gap-4 cursor-pointer "
            >
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                {place.photos.length > 0 && (
                  <img
                    className="object-cover"
                    style={{ width: "100%" }}
                    src={"http://localhost:4000/uploads/" + place.photos[0]}
                    alt={place._id}
                  />
                )}
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2 text-gray-800">
                  {place.description.slice(0, 300) + "..."}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PlacesPage;

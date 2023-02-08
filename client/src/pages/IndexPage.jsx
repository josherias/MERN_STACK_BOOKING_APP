import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPlaces() {
      setLoading(true);
      try {
        const { data } = await axios.get("/places");
        setPlaces(data);
      } catch (ex) {
      } finally {
        setLoading(false);
      }
    }

    getPlaces();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id} key={place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt="img"
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-xs text-gray-500">{place.title}</h3>
            <div className="mt-1">
              {" "}
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        ))}
    </div>
  );
};

export default IndexPage;

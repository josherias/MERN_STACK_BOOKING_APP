import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { UserContext } from "../context/UserContext";

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) return "Loading...";

  if (ready && !user && !redirect) return <Navigate to="/login" />;

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div>
      <AccountNav />

      <div className=" text-center max-w-lg mx-auto ">
        Logged in as {user.name} {user.email} <br />
        <button onClick={logout} className="primary max-w-sm mt-2">
          logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

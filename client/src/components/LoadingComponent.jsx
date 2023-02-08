import React from "react";
import Loading from "../assets/loading.gif";

const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center w-[100%] h-screen">
      <img src={Loading} alt="loading..." />
    </div>
  );
};

export default LoadingComponent;

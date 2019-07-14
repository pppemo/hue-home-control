import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default ({ isLoading }) => (
  <BounceLoader sizeUnit={"px"} size={250} color={"#123abc"} loading={isLoading} />
);

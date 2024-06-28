import React, { useEffect, useState } from "react";

const Confirm = () => {
  console.log("1");

  const [num, setNum] = useState(1);
  useEffect(() => {
    console.log("3");
  }, []);

  useEffect(() => {
    console.log("num이 바뀔때마다");
  }, [num]);

  return <div>{console.log("2")}</div>;
};

export default Confirm;

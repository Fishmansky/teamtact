import { useEffect, useState } from "react";

function Plan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("api/workers")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => console.log("GET Error:", err));
  }, []);

  if (!loading) {
    console.log(data);
  }

  return <div>Hello</div>;
}

export default Plan;

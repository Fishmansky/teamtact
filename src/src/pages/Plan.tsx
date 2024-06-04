import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <header>
      <div className="workers">
        <Link className="a" to="/workers">
          Workers
        </Link>
      </div>
      <div className="plan">
        <Link className="a" to="/">
          Plan
        </Link>
      </div>
    </header>
  );
}

export default Plan;

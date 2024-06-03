import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Plan() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("workers")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        console.log(data);
      })
      .catch((err) => console.log("GET Error:", err));
  }, []);

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

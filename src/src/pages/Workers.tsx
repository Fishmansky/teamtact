import { useState } from "react";
import { Link } from "react-router-dom";

function Workers() {
  const [form, setForm] = useState({ fname: "", sname: "" });

  function handleFname(e: any) {
    setForm({ ...form, fname: e.target.value });
  }

  function handleSname(e: any) {
    setForm({ ...form, sname: e.target.value });
  }

  function handleSubmit() {
    fetch("worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => result.json())
      .then((result) => console.log("Response:", result))
      .catch((err) => console.log("POST Error:", err));
  }

  return (
    <>
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
      <div className="form">
        <input
          className="name"
          type="text"
          placeholder="fname"
          onChange={handleFname}
        />
        <input
          className="name"
          type="text"
          placeholder="sname"
          onChange={handleSname}
        />
        <button className="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>
  );
}

export default Workers;

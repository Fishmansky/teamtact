import { useState } from "react";
import styles from "./styles/Form.module.css";

function Form() {
  const [form, setForm] = useState({ fname: "", sname: "" });

  function handleFname(e: any) {
    setForm({ ...form, fname: e.target.value });
  }

  function handleSname(e: any) {
    setForm({ ...form, sname: e.target.value });
  }

  function handleSubmit() {
    fetch("api/worker", {
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
    <div className={styles.form}>
      <input
        className={styles.name}
        type="text"
        placeholder="Imię"
        onChange={handleFname}
      />
      <input
        className={styles.name}
        type="text"
        placeholder="Nazwisko"
        onChange={handleSname}
      />
      <button className={styles.submit} onClick={handleSubmit}>
        Dodaj
      </button>
    </div>
  );
}

export default Form;

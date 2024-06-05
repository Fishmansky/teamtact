import { useState } from "react";
import styles from "./styles/Form.module.css";

interface Data {
  id: number;
  fname: string;
  sname: string;
}
type Props = {
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
};

function Form({ setData }: Props) {
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
      .then((result) => {
        console.log("Response:", result);
        setForm({ fname: "", sname: "" });
        return fetch("api/workers");
      })
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
      .catch((err) => console.log("POST Error:", err));
  }

  return (
    <div className={styles.form}>
      <input
        className={styles.name}
        type="text"
        placeholder="Imię"
        spellCheck="false"
        value={form.fname}
        onChange={handleFname}
      />
      <input
        className={styles.name}
        type="text"
        placeholder="Nazwisko"
        spellCheck="false"
        value={form.sname}
        onChange={handleSname}
      />
      <button className={styles.submit} onClick={handleSubmit}>
        Dodaj
      </button>
    </div>
  );
}

export default Form;

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
  const [error, setError] = useState(false);

  function handleFname(e: any) {
    setForm({ ...form, fname: e.target.value });
  }

  function handleSname(e: any) {
    setForm({ ...form, sname: e.target.value });
  }

  function handleSubmit() {
    if (!form.fname.trim() || !form.sname.trim()) {
      setError(true);
    } else {
      setError(false);
      fetch("api/worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: form.fname.trim(),
          sname: form.sname.trim(),
        }),
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
  }

  return (
    <div className={styles.form}>
      {!error && <p className={styles.add}>Dodaj pracownika:</p>}
      {error && <p className={styles.error}>Najpierw dodaj imię i nazwisko!</p>}
      <input
        className={!error ? styles.name : styles.nameError}
        type="text"
        placeholder="Imię"
        spellCheck="false"
        value={form.fname}
        onChange={handleFname}
      />
      <input
        className={!error ? styles.name : styles.nameError}
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

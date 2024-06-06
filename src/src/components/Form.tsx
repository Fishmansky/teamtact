import { useState } from "react";
import styles from "./styles/Form.module.css";

interface Data {
  id: number;
  fname: string;
  sname: string;
}
type Props = {
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
  setMainStatus: React.Dispatch<
    React.SetStateAction<{
      status: number;
      message: string;
    }>
  >;
};

function Form({ setData, setMainStatus }: Props) {
  const [form, setForm] = useState({ fname: "", sname: "" });
  const [status, setStatus] = useState({
    status: 1,
    message: "Dodaj pracownika:",
  });

  function handleFname(e: any) {
    setForm({ ...form, fname: e.target.value });
  }

  function handleSname(e: any) {
    setForm({ ...form, sname: e.target.value });
  }

  function handleSubmit() {
    if (!form.fname.trim() || !form.sname.trim()) {
      setStatus({ status: 0, message: "Najpierw dodaj imię i nazwisko!" });
    } else {
      setStatus({ status: 1, message: "Dodaj pracownika:" });
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
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Błąd podczas łączenia z serwerem");
          }
        })
        .then((response) => {
          setMainStatus({ status: response.status, message: response.message });
          setForm({ fname: "", sname: "" });
          return fetch("api/workers");
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Błąd podczas łączenia z serwerem");
          }
        })
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          console.log(`POST error: ${err.message}`);
          setMainStatus({
            status: 0,
            message: "Wystąpił błąd podczas dodawania pracownika",
          });
          setForm({ fname: "", sname: "" });
        });
    }
  }

  return (
    <div className={styles.form}>
      <p className={status.status ? styles.add : styles.error}>
        {status.message}
      </p>
      <input
        className={status.status ? styles.name : styles.nameError}
        type="text"
        placeholder="Imię"
        spellCheck="false"
        value={form.fname}
        onChange={handleFname}
      />
      <input
        className={status.status ? styles.name : styles.nameError}
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

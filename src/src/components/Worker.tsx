import styles from "./styles/Worker.module.css";

interface Data {
  id: number;
  fname: string;
  sname: string;
}
type Props = {
  id: number;
  fname: string;
  sname: string;
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
};

function Worker({ id, fname, sname, setData }: Props) {
  function handleDelete() {
    fetch(`/api/worker/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Response:", response);
        return fetch("api/workers");
      })
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
      .catch((err) => console.log("DELETE error:", err));
  }

  return (
    <div className={styles.item}>
      <p className={styles.name}>
        {fname} {sname}
      </p>
      <p className={styles.delete} onClick={handleDelete}>
        X
      </p>
    </div>
  );
}

export default Worker;

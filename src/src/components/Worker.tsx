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
  setMainStatus: React.Dispatch<
    React.SetStateAction<{
      status: number;
      message: string;
    }>
  >;
};

function Worker({ id, fname, sname, setData, setMainStatus }: Props) {
  function handleDelete() {
    fetch(`/api/worker/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((response) => {
        setMainStatus({ status: response.status, message: response.message });
        return fetch("api/workers");
      })
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        console.log("DELETE error:", err);
        setMainStatus({
          status: 0,
          message: "Wystąpił błąd podczas usuwania pracownika",
        });
      });
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

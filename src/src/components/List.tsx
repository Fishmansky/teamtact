import styles from "./styles/List.module.css";
import loadingStyle from "./styles/Worker.module.css";
import Worker from "./Worker";

interface Data {
  id: number;
  fname: string;
  sname: string;
}
type Props = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
  loading: boolean;
  mainStatus: {
    status: number;
    message: string;
  };
  setMainStatus: React.Dispatch<
    React.SetStateAction<{
      status: number;
      message: string;
    }>
  >;
};

function List({ data, setData, loading, mainStatus, setMainStatus }: Props) {
  return (
    <div className={styles.list}>
      <div className={styles.listBox}>
        <div className={styles.info}>
          <p>Lista pracowników:</p>
          <p className={mainStatus.status ? styles.status1 : styles.status0}>
            {mainStatus.message}
          </p>
        </div>
        {loading && (
          <div className={loadingStyle.item}>
            <p className={loadingStyle.name}>Ładowanie . . .</p>
          </div>
        )}
        {!loading &&
          (data ? (
            data.map((item: Data) => (
              <Worker
                key={item.id}
                id={item.id}
                fname={item.fname}
                sname={item.sname}
                setData={setData}
                setMainStatus={setMainStatus}
              />
            ))
          ) : (
            <div className={loadingStyle.item}>
              <p className={loadingStyle.name}>Brak aktualnych pracowników.</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default List;

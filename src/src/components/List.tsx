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
};

function List({ data, setData, loading }: Props) {
  return (
    <div className={styles.list}>
      <div className={styles.listBox}>
        {loading && (
          <div className={loadingStyle.item}>
            <p className={loadingStyle.name}>Ładowanie . . .</p>
          </div>
        )}
        {!loading && data ? (
          data.map((item: Data) => (
            <Worker
              key={item.id}
              id={item.id}
              fname={item.fname}
              sname={item.sname}
              setData={setData}
            />
          ))
        ) : (
          <div className={loadingStyle.item}>
            <p className={loadingStyle.name}>Brak aktualnych pracowników.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;

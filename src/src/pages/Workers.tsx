import { useEffect, useState } from "react";
import Form from "../components/Form";
import List from "../components/List";

function Workers() {
  const [data, setData] = useState<Data[]>([{ id: 0, fname: "", sname: "" }]);
  const [loading, setLoading] = useState(true);
  const [mainStatus, setMainStatus] = useState({ status: 1, message: "" });

  interface Data {
    id: number;
    fname: string;
    sname: string;
  }

  useEffect(() => {
    fetch("api/workers")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        console.log("GET error:", err);
        setMainStatus({
          status: 0,
          message: "Wystąpił błąd podczas pobierania listy pracowników",
        });
      });
  }, []);

  return (
    <section className="container-workers">
      <Form setData={setData} setMainStatus={setMainStatus} />
      <List
        data={data}
        setData={setData}
        loading={loading}
        mainStatus={mainStatus}
        setMainStatus={setMainStatus}
      />
    </section>
  );
}

export default Workers;

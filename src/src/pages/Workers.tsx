import { useEffect, useState } from "react";
import Form from "../components/Form";
import List from "../components/List";

function Workers() {
  const [data, setData] = useState<Data[]>([{ id: 0, fname: "", sname: "" }]);
  const [loading, setLoading] = useState(true);

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
      .catch((err) => console.log("GET Error:", err));
  }, []);

  return (
    <section className="container-workers">
      <Form setData={setData} />
      <List data={data} setData={setData} loading={loading} />
    </section>
  );
}

export default Workers;

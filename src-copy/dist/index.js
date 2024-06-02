let data;
fetch("workers")
  .then((response) => response.json())
  .then((response) => {
    data = response;
    console.log(data);
  })
  .catch((err) => console.log("GET Error:", err));
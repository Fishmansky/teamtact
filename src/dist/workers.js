document.querySelector(".submit").addEventListener("click", () => {
    let data = {
      fname: `${document.querySelector(".fname-js").value}`,
      sname: `${document.querySelector(".sname-js").value}`,
    };
    fetch("worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((result) => console.log("Response:", result))
      .catch((err) => console.log("POST Error:", err));
  });
  
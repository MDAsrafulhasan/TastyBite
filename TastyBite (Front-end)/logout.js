const handlelogOut = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  // fetch("https://tastybite.onrender.com/customer/logout", {
  fetch("http://127.0.0.1:8000/customer/logout", {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log("logout completed");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      // window.location.href = "/index.html";
      window.location.href = "http://127.0.0.1:5500/TastyBite%20(Front-end)/index.html";
    });
};

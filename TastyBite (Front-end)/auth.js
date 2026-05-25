const handleRegistration = (event) => {
  event.preventDefault();
  // console.log("kire");
  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const contact_number = getValue("contuct_number");
  const address = getValue("address");
  const password = getValue("password");
  const confirm_password = getValue("password2");
  const image = document.getElementById("image").files[0];

  const data = new FormData();
  data.append("image", image);
  fetch("https://api.imgbb.com/1/upload?key=83fc93bc353ca9ec2b52e23efe6a2017", {     // using imgbb we can upload and save the image in database 
    method: "POST",
    body: data,
  })
    .then(res => res.json())
    .then(data => {
      const info = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
        contact_number,
        address,
        image: data.data.url,
      };

      if (password === confirm_password) {
        document.getElementById("error").innerText = "";
        if (
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            password
          )
        ) {
          console.log(info);

          // fetch("https://tastybite.onrender.com/customer/register/", {
          fetch("http://127.0.0.1:8000/customer/register/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              showToast("Registration Successful! Check your email", "success");
            });

        } else {
          document.getElementById("error").innerText =
            "pass must contain eight characters, at least one letter, one number and one special character:";
        }
      } else {
        document.getElementById("error").innerText =
          "password and confirm password do not match";
        showToast("Password and confirm password do not match", "error");
      }

    });

};

const handleLogin=(event)=>{
  event.preventDefault();
  const username = getValue("login-username");
  const password = getValue("login-password");
  // console.log(username,password);
  if(username,password){
    // fetch("https://tastybite.onrender.com/customer/login/",
    fetch("http://127.0.0.1:8000/customer/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.token && data.user_id)
        {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("is_admin", data.is_admin);
          showToast("Login Successful! Welcome back.", "success");
          
          // Delay redirect slightly so the user can see the premium toast notification
          setTimeout(() => {
            // window.location.href = "/food.html";
            window.location.href = "http://127.0.0.1:5500/TastyBite%20(Front-end)/food.html";
          }, 1200);
        } else {
          // If login failed, display an error toast
          const errorMsg = data.error || (data.non_field_errors && data.non_field_errors[0]) || "Invalid username or password!";
          showToast(errorMsg, "error");
        }
      })
      .catch(error => {
        console.error("Login connection error:", error);
        showToast("Unable to connect to login server.", "error");
      });
  }
};

const getValue = (id) => {
  // return document.getElementById(id).value;
  const value = document.getElementById(id).value;
  return value;
}

const togglePassword = (inputId, iconElement) => {
  const passwordInput = document.getElementById(inputId);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    iconElement.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    iconElement.classList.replace("fa-eye-slash", "fa-eye");
  }
};





// withcout using imgbb. means without uploading this code is good


    // const info = {       
    //   username,
    //   first_name,
    //   last_name,
    //   email,
    //   password,
    //   confirm_password,
    //   contact_number,
    //   address,
    //   image: data.data.url,
    // };
  // console.log(info);


  // if (password === confirm_password) {
  //     document.getElementById("error").innerText = "";
  //     if (
  //       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
  //         password
  //       )
  //     ) {
  //     //   console.log(info);

  //       fetch("https://tastybite.onrender.com/customer/register/", {
  //         method: "POST",
  //         headers: { "content-type": "application/json" },
  //         body: JSON.stringify(info),
  //       })
  //         .then((res) => res.json())
  //         .then((data) => console.log(data));



  //     } else {
  //       document.getElementById("error").innerText =
  //         "pass must contain eight characters, at least one letter, one number and one special character:";
  //     }
  //   } else {
  //     document.getElementById("error").innerText =
  //       "password and confirm password do not match";
  //     showToast("Password and confirm password do not match", "error");
  //   }
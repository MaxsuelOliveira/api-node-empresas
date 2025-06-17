async function get() {
  fetch("https://proton.mysuite1.com.br/client/ajax/logar.php", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua":
        '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "x-requested-with": "XMLHttpRequest",
      Referer: "https://proton.mysuite1.com.br/client/login.php",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: "email=docebrasil%40lv.com&senha=123456&codempresa=&codunidade=&loginforcado=&lembreme=1&horacliente=1748586674295&dt=180&setorchatpadrao=&dadosbrowser%5Bbrowser%5D=Chrome&dadosbrowser%5Bbrowserversion%5D=136.0.0.0&dadosbrowser%5Bos%5D=Windows&dadosbrowser%5Bosversion%5D=10",
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {

        console.log("Response data:", data);    

      if (data.status === "ok") {
        console.log("Login successful:", data);
        // Redirect or perform further actions after successful login
      } else {
        console.error("Login failed:", data.message);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

get()
  .then(() => {
    console.log("Login attempt completed.");
  })
  .catch((error) => {
    console.error("Error during login attempt:", error);
  });

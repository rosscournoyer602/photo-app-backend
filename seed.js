const photoJson = require("./photos.json");
const baseUrl = "http://localhost:8080";

photoJson.forEach((photo) => {
  fetch(`${baseUrl}/photo`, {
    method: "POST",
    body: JSON.stringify({
      index: photo.index,
      name: photo.name,
      src: photo.src,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
});

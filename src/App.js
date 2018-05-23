// import Clarifai from "clarifai";
//
// document.getElementById("hello-iam").addEventListener("change", async function(event) {
//   const app = new Clarifai.App({
//    apiKey: 'a1e856e212c24e44867e0baed3e0832e'
//   });
//
//   const fullImage = await getBase64(event.target.files[0]);
//   const image = fullImage.split("base64,").pop();
//
//   app.models.predict(Clarifai.FACE_DETECT_MODEL, [{ base64: image, id: "ONE" }, { base64: image, id: "TWO" }], {video: false})
//   .then((response) => {
//     debugger;
//     var img = document.createElement("img");
//     img.src = fullImage;
//     document.body.appendChild(img);
//     console.log(response);
//   })
//   .catch((error) => {
//     debugger;
//   });
// });
//
//
// async function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function () {
//       resolve(reader.result);
//     };
//     reader.onerror = function (error) {
//       console.log('Error: ', error);
//       reject(error)
//     };
//   })
// }

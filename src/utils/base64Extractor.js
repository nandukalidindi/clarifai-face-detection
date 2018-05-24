/**
 * Utility method to extract Base64 value of the uploaded file
 *
 * @param {object} file
 * @return {Promise}
 */

const BASE64_EXTRACTOR = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
      reject(error);
    };
  })
}

export default BASE64_EXTRACTOR;

const searchBar = document.querySelector("#search-bar");
const submit = document.querySelector("input[type=submit]");
const clearGifButton = document.querySelector("#clear-gifs");
const gifContainer = document.querySelector("#gif-container");

const gifIDSet = new Set();

const giphyKey = "Y6rG8VJyAwsgpZectHkvEPGN99o9J4oG";
/* Typically, storing an API key in client-side code is not best-practice;
   however, Giphy keys are expected to be used client side and are monitored
   by Giphy for any abuses.
*/

async function makeGiphyRequest(searchItem) {
  try {
    let giphyResponse = await axios.get(
      "https://api.giphy.com/v1/gifs/random",
      {
        params: { tag: searchItem, api_key: giphyKey, rating: "pg-13" },
      }
    );
    return checkForUniqueGif(giphyResponse);
  } catch (error) {
    console.log(error);
  }
}

async function checkForUniqueGif(gif) {
  if (gif.data.data.length === 0) {
    searchBar.setCustomValidity("No gifs found for this search!");
    searchBar.reportValidity();
    return null;
  }
  if (gifIDSet.has(gif.data.data.id)) {
    searchBar.setCustomValidity("GIPHY sent a duplicate gif!");
    searchBar.reportValidity();
    return null;
  }
  gifIDSet.add(gif.data.data.id);
  return gif;
}

searchBar.addEventListener("input", function (evt) {
  searchBar.setCustomValidity("");
});

submit.addEventListener("click", async function (evt) {
  evt.preventDefault();
  let checkInputs = Boolean(searchBar.value);
  if (checkInputs) {
    let gifInfo = await makeGiphyRequest(searchBar.value, giphyKey);
    if (gifInfo) {
      addRandomGif(gifInfo.data.data);
    }
  }
});

clearGifButton.addEventListener("click", function (evt) {
  gifContainer.textContent = "";
  searchBar.value = "";
  gifIDSet.clear();
  clearGifButton.disabled = true;
});

async function addRandomGif(gifInfo) {
  let gif = document.createElement("img");
  gif.src = gifInfo.images.original.url;
  gif.classList.add("gif-image");
  gifContainer.prepend(gif);
  clearGifButton.disabled = false;
}

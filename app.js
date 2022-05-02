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

searchBar.setCustomValidity("No unique Gifs found for this term!");

async function makeGiphyRequest(searchItem) {
  try {
    let giphyResponse = await axios.get(
      "https://api.giphy.com/v1/gifs/random",
      {
        params: { tag: searchItem, api_key: giphyKey, rating: "pg-13" },
      }
    );
    giphyResponse = await checkForUniqueGif(giphyResponse);
    return giphyResponse;
  } catch (error) {
    console.log(error);
  }
}

async function checkForUniqueGif(gif) {
  let gifInfo = gif;
  if (gifIDSet.has(gifInfo.data.data.id)) {
    gifInfo = await axios.get("https://api.giphy.com/v1/gifs/random", {
      params: { tag: searchItem, api_key: giphyKey, rating: "pg-13" },
    });
  }
  if (gifIDSet.has(gifInfo.data.data.id) || gifInfo.data.data.length === 0) {
    searchBar.reportValidity();
    gifInfo = null;
  } else {
    gifIDSet.add(gif.data.data.id);
  }
  return gifInfo;
}

searchBar.addEventListener("input", function (evt) {
  searchBar.setCustomValidity("");
});

submit.addEventListener("click", submitInfoToGiphy);

clearGifButton.addEventListener("click", function (evt) {
  gifContainer.textContent = "";
  searchBar.value = "";
  gifIDSet.clear();
});

function checkInputs() {
  return Boolean(searchBar.value);
}

async function addRandomGif(gifInfo) {
  let gif = document.createElement("img");
  gif.src = gifInfo.images.original.url;
  gifContainer.append(gif);
}

async function submitInfoToGiphy(evt) {
  evt.preventDefault();
  if (checkInputs()) {
    let gifInfo = await makeGiphyRequest(searchBar.value, giphyKey);
    if (gifInfo) {
      addRandomGif(gifInfo.data.data);
    }
  }
}

function resizeContent() {
  let windowSize = Math.min(window.screen.availWidth, window.innerWidth);
  let newSize = 14 + 60000000 / (1 + (windowSize * 3715) ** 1.03);
  document.querySelector("html").style.fontSize = newSize + "px";
}

document.addEventListener("DOMContentLoaded", resizeContent);

window.addEventListener("resize", resizeContent);

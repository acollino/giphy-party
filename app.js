const searchBar = document.querySelector("#search-bar");
const submit = document.querySelector("input[type=submit]");
const keyTextBar = document.querySelector("#key");
const recordKeyButton = document.querySelector("#record-key");
const deleteKeyButton = document.querySelector("#delete-key");
const clearGifButton = document.querySelector("#clear-gifs");
const gifContainer = document.querySelector("#gif-container");
const gifIDSet = new Set();

async function makeGiphyRequest(searchItem, apiKey) {
  try {
    let giphyResponse = await axios.get("http://api.giphy.com/v1/gifs/random", {
      params: { tag: searchItem, api_key: apiKey, rating: "pg-13" },
    });
    if (gifIDSet.has(giphyResponse.data.data.id)) {
      return makeGiphyRequest(searchItem, apiKey);
    }
    gifIDSet.add(giphyResponse.data.data.id);
    return giphyResponse;
  } catch (error) {
    console.log(error);
  }
}

recordKeyButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  localStorage.setItem("key", keyTextBar.value);
});

deleteKeyButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  localStorage.removeItem("key");
});

submit.addEventListener("click", async function (evt) {
  evt.preventDefault();
  if (checkInputs()) {
    let gifInfo = await makeGiphyRequest(searchBar.value, keyTextBar.value);
    addRandomGif(gifInfo.data.data);
  }
});

clearGifButton.addEventListener("click", function (evt) {
  gifContainer.textContent = "";
  gifIDSet.clear();
});

if (localStorage.getItem("key")) {
  keyTextBar.value = localStorage.getItem("key");
}

function checkInputs() {
  return Boolean(keyTextBar.value && searchBar.value);
}

async function addRandomGif(gifInfo) {
  let gif = document.createElement("img");
  gif.src = gifInfo.images.original.url;
  gifContainer.append(gif);
}

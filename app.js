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
    let giphyResponse = await axios.get("https://api.giphy.com/v1/gifs/random", {
      params: { tag: searchItem, api_key: apiKey, rating: "pg-13" },
    });
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
      params: { tag: searchItem, api_key: apiKey, rating: "pg-13" },
    });
  }
  if (gifIDSet.has(gifInfo.data.data.id) || gifInfo.data.data.length === 0) {
    searchBar.setCustomValidity("No unique Gifs found for this term!");
    searchBar.reportValidity();
    gifInfo = null;
  }
  else {
    searchBar.setCustomValidity("");
    gifIDSet.add(gif.data.data.id);
  }
  return gifInfo;
}

recordKeyButton.addEventListener("click", function (evt) {
  if (keyTextBar.checkValidity()) {
    localStorage.setItem("key", keyTextBar.value);
  }
  else {
    keyTextBar.reportValidity();
  }
});

deleteKeyButton.addEventListener("click", function (evt) {
  localStorage.removeItem("key");
  keyTextBar.value = "";
});

submit.addEventListener("click", submitInfoToGiphy);

clearGifButton.addEventListener("click", function (evt) {
  gifContainer.textContent = "";
  searchBar.setCustomValidity("");
  searchBar.value = "";
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

async function submitInfoToGiphy(evt) {
  evt.preventDefault();
  if (checkInputs()) {
    let gifInfo = await makeGiphyRequest(searchBar.value, keyTextBar.value);
    if (gifInfo) {
      addRandomGif(gifInfo.data.data);
    }
  }
}

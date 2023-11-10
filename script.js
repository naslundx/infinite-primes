// UI
const cardContainer = document.getElementById("card-container");
const loader = document.getElementById("loader");
const settingsIcon = document.getElementById("settings-icon");
const settingsContent = document.getElementById("settings-content");
const UIshowComposites = document.getElementById("show-composites");

// Settings
let cardIndex = 1;

// Helpers
var throttleRunner = false;

const throttle = (callback, time) => {
  if (throttleRunner)
    return;

  throttleRunner = true;
  setTimeout(() => {
    callback();
    throttleRunner = false;
  }, time);
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Mathematical
const isPrime = number => {
    if (number < 2) return false;
    if (number === 2 || number === 3) return true;
    if (number % 2 === 0) return false;

    for (let d = 5; d <= Math.floor(Math.sqrt(number)); d += 2) {
        if (number % d === 0) {
            return false;
        }
    }

    return true;
}

// Website
const createCard = (index, prime = false) => {
  const card = document.createElement("div");
  card.innerText = index;
  card.className = prime ? "card prime" : "card composite";
  cardContainer.appendChild(card);
};

var creatingCards = false;
const createCards = async (numberToCreate) => {
  if (creatingCards) {
    return;
  }
  const showComposites = localStorage.getItem("showComposites") === "true";
  creatingCards = true;
  while (numberToCreate > 0) {
    const prime = isPrime(cardIndex);
    if (prime || showComposites) {
        createCard(cardIndex, prime);
        numberToCreate -= 1;
        await sleep(1);
    }
    cardIndex += 1;
  }
  await sleep(1);
  creatingCards = false;
};

const handleInfiniteScroll = () => {
  throttle(async () => {
    const nearEndOfPage = window.scrollY + window.innerHeight * 3 >= document.body.offsetHeight;
    if (nearEndOfPage) {
        createCards(100);
    }
  }, 10);
};

window.onload = () => createCards(10);
window.addEventListener("scroll", handleInfiniteScroll);

// Preferences
UIshowComposites.addEventListener("change", event => {
  localStorage.setItem("showComposites", event.target.checked.toString());
});

settingsIcon.addEventListener("click", () => {
  settingsIcon.classList.add('hide');
  settingsContent.classList.remove('hide');
});



// UI
const cardContainer = document.getElementById("card-container");
const settingsIcon = document.getElementById("settings-icon");
const settingsContent = document.getElementById("settings-content");
const UIshowComposites = document.getElementById("show-composites");
const UIsettingsSave = document.getElementById("settings-save");

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
const allPrimes = new Set([2, 3, 5, 7, 11, 13, 17]);
const isPrime = number => {
    if (number < 2) return false;
    if (allPrimes.has(number)) return true;
    if (number % 2 === 0) return false;

    for (prime of allPrimes) {
        if (number % prime === 0) {
            console.log(`${number} is divisible by ${prime}`);
            return false;
        }
    };

    allPrimes.add(number);
    return true;
}

const isSexyPrime = number => allPrimes.has(number) && allPrimes.has(number - 6);

// Website
const createCard = (index, prime = false) => {
  const card = document.createElement("div");
  card.innerHTML = `<p>${index}</p>`;
  card.className = prime ? "card prime" : "card composite";
  cardContainer.appendChild(card);

  if (isSexyPrime(index)) {
    card.innerHTML = '<i class="sexy fa fa-heart"></i>' + card.innerHTML;
  }
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

window.onload = () => {
    UIshowComposites.checked = localStorage.getItem("showComposites") === "true";
    createCards(1000);
}
window.addEventListener("scroll", handleInfiniteScroll);

// Preferences
UIsettingsSave.addEventListener("click", () => {
    localStorage.setItem("showComposites", UIshowComposites.checked);
    window.location.reload();
})

settingsIcon.addEventListener("click", () => {
  settingsIcon.classList.add('hide');
  settingsContent.classList.remove('hide');
});

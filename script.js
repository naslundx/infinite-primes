// UI
const cardContainer = document.getElementById("card-container");
const settingsIcon = document.getElementById("settings-icon");
const settingsContent = document.getElementById("settings-content");
const UIshowComposites = document.getElementById("show-composites");
const UIshowSexy = document.getElementById("show-sexy");
const UIshowFibonacci = document.getElementById("show-fibonacci");
const UIsettingsSave = document.getElementById("settings-save");

// Settings
let cardIndex = 1;
let settingsWindowOpen = false;
const showComposites = localStorage.getItem("showComposites") === "true";
const showSexy = localStorage.getItem("showSexy") === "true";
const showFibonacci = localStorage.getItem("showFibonacci") === "true";

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

const allFibonacci = [1, 2, 3, 5, 8, 13];
const isFibonacci = number => {
  if (allFibonacci.includes(number)) return true;
  if (number > allFibonacci[allFibonacci.length - 1]) {
    const nextNumber = allFibonacci[allFibonacci.length - 1] + allFibonacci[allFibonacci.length - 2]
    allFibonacci.push(nextNumber);
    return number === nextNumber;
  }
  return false;
}

const isSexyPrime = number => allPrimes.has(number) &&
  !allPrimes.has(number - 2) &&
  !allPrimes.has(number - 4) &&
  allPrimes.has(number - 6);

// Website
const createCard = (index, prime = false) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="col-number">
      <p>${index}</p>
    </div>
    <div class="col-details">
    <p class="sexy"><i class="fa fa-heart"></i> Sexy prime</p>
    <p class="fibonacci"><i class="fa fa-flask"></i> Fibonacci</p>
    </div>`;
  card.className = prime ? "card prime" : "card composite";
  
  if (showSexy && isSexyPrime(index)) {
    card.classList.add('sexy');
  }
  if (showFibonacci && isFibonacci(index)) {
    card.classList.add('fibonacci');
  }

  cardContainer.appendChild(card);
};

var creatingCards = false;
const createCards = async (numberToCreate) => {
  if (creatingCards) {
    return;
  }
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
  UIshowComposites.checked = showComposites;
  UIshowFibonacci.checked = showFibonacci;
    createCards(10);
}
window.addEventListener("scroll", handleInfiniteScroll);

// Preferences
document.querySelector('#card-container').addEventListener("click", () => {
  if (settingsWindowOpen) {
    settingsIcon.classList.remove('hide');
    settingsContent.classList.add('hide');
  }
  console.log('clicked');
});

UIsettingsSave.addEventListener("click", () => {
  localStorage.setItem("showComposites", UIshowComposites.checked);
  localStorage.setItem("showSexy", UIshowSexy.checked);
  localStorage.setItem("showFibonacci", UIshowFibonacci.checked);
  window.location.reload();
})

settingsIcon.addEventListener("click", event => {
  settingsIcon.classList.add('hide');
  settingsContent.classList.remove('hide');
  settingsWindowOpen = true;
  event.stopPropagation();
});

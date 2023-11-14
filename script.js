// UI
const cardContainer = document.getElementById("card-container");
const settingsIcon = document.getElementById("settings-icon");
const settingsContent = document.getElementById("settings-content");
const UIsettingsSave = document.getElementById("settings-save");

// UI settings
const allSettings = [
  'primes',
  'composites',
  'sexy',
  'fibonacci',
  'odd',
  'even',
];

const getUISetting = (name) => {
  const uiShow = document.getElementById(`show-${name}`);
  const uiMark = document.getElementById(`mark-${name}`);
  if (uiShow.checked) {
    return 'show';
  } else if (uiMark.checked) {
    return 'mark';
  } else {
    return 'hide';
  }
}

const setUISetting = (name, value) => {
  const ui = document.getElementById(`${value}-${name}`);
  ui.checked = true;
}

const setLocalStorageSetting = (name, value) => {
  localStorage.setItem(name, value);
}

const getLocalStorageSetting = (name) => {
  const defaultValue = defaultSettings[name];
  const value = localStorage.getItem(name);
  return value || defaultValue;
}

// Settings
let latestNumber = 1;
let settingsWindowOpen = false;
const defaultSettings = {
  'primes': 'show',
  'composites': 'hide',
  'sexy': 'mark',
  'fibonacci': 'mark',
  'odd': 'show',
  'even': 'show',
};
const currentSettings = {};

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

const isSexyPrime = number => allPrimes.has(number) && allPrimes.has(number - 6);

// Website
const createCard = (index, data) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="col-number">
      <p>${index}</p>
    </div>
    <div class="col-details">
      <p class="even"><i class="fa fa-calendar-plus-o"></i> Even</p>
      <p class="odd"><i class="fa fa-calendar-minus-o"></i> Odd</p>
      <p class="sexy"><i class="fa fa-heart"></i> Sexy prime</p>
      <p class="fibonacci"><i class="fa fa-flask"></i> Fibonacci</p>
    </div>`;

  card.className = 'card';
  
  if (currentSettings['primes'] ==='show' && data.prime) {
    card.classList.add('prime');
  }
  if (currentSettings['composites'] ==='show' && data.composite) {
    card.classList.add('composite');
  }
  
  if (currentSettings['primes'] === 'mark' && data.prime) {
    card.classList.add('mark-prime');
  }
  if (currentSettings['composites'] === 'mark' && data.composite) {
    card.classList.add('mark-composite');
  }
  if (currentSettings['sexy'] === 'mark' && data.sexy) {
    card.classList.add('mark-sexy');
  }
  if (currentSettings['fibonacci'] === 'mark' && data.fibonacci) {
    card.classList.add('mark-fibonacci');
  }
  if (currentSettings['even'] === 'mark' && data.even) {
    card.classList.add('mark-even');
  }
  if (currentSettings['odd'] === 'mark' && data.odd) {
    card.classList.add('mark-odd');
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
    let create = false;

    const prime = isPrime(latestNumber);
    const composite = !prime;
    const sexy = prime && isSexyPrime(latestNumber);
    const fibonacci = isFibonacci(latestNumber);
    const even = latestNumber % 2 === 0;
    const odd = !even;

    if (currentSettings['primes'] === 'show') create = create || prime;
    if (currentSettings['composites'] === 'show') create = create || composite;
    if (currentSettings['sexy'] === 'show') create = create || sexy;
    if (currentSettings['fibonacci'] === 'show') create = create || fibonacci;
    if (currentSettings['even'] === 'show') create = create || even;
    if (currentSettings['odd'] === 'show') create = create || odd;

    if (currentSettings['primes'] === 'hide') create = create && !prime;
    if (currentSettings['composites'] === 'hide') create = create && !composite;
    if (currentSettings['sexy'] === 'hide') create = create && !sexy;
    if (currentSettings['fibonacci'] === 'hide') create = create && !fibonacci;
    if (currentSettings['even'] === 'hide') create = create && !even;
    if (currentSettings['odd'] === 'hide') create = create && !odd;

    data = { prime, composite, sexy, fibonacci, even, odd };
    console.log(latestNumber, data)

    if (create) {
        createCard(latestNumber, data);
        numberToCreate -= 1;
        await sleep(1);
    }

    latestNumber += 1;
    numberToCreate -= 1;
  }
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
  allSettings.forEach(setting => {
    currentSettings[setting] = getLocalStorageSetting(setting);
    setUISetting(setting, currentSettings[setting]);
  });

  console.log(currentSettings);
  
  createCards(10);

}
window.addEventListener("scroll", handleInfiniteScroll);

// Preferences
document.querySelector('#card-container').addEventListener("click", () => {
  if (settingsWindowOpen) {
    settingsIcon.classList.remove('hide');
    settingsContent.classList.add('hide');
  }
});

UIsettingsSave.addEventListener("click", () => {
  allSettings.forEach(setting => setLocalStorageSetting(setting, getUISetting(setting)));
  window.location.reload();
})

settingsIcon.addEventListener("click", event => {
  settingsIcon.classList.add('hide');
  settingsContent.classList.remove('hide');
  settingsWindowOpen = true;
  event.stopPropagation();
});

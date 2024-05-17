'use strict';
// Bankify App
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Siddharth Verma',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 2469,

  movementsDates: [
    '2023-12-26T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-02-20T09:15:04.904Z',
    '2024-02-25T10:17:24.185Z',
    '2024-03-10T14:11:59.604Z',
    '2024-03-12T17:01:17.194Z',
    '2024-03-13T23:36:17.929Z',
    '2024-03-14T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Rahul Sharma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1619,

  movementsDates: [
    '2023-12-28T13:15:33.035Z',
    '2024-01-28T09:48:16.867Z',
    '2024-02-09T06:04:23.907Z',
    '2024-02-25T14:18:46.235Z',
    '2024-03-09T16:33:06.386Z',
    '2024-03-10T14:43:26.374Z',
    '2024-03-12T18:49:59.371Z',
    '2024-03-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Aryan Mishra',
  movements: [2000, -200, 340, -300, -20, 50, 2800, -460],
  interestRate: 1,
  pin: 1991,

  movementsDates: [
    '2024-01-28T13:15:33.035Z',
    '2024-02-14T09:48:16.867Z',
    '2024-02-20T06:04:23.907Z',
    '2024-03-01T14:18:46.235Z',
    '2024-03-08T16:33:06.386Z',
    '2024-03-11T14:43:26.374Z',
    '2024-03-12T18:49:59.371Z',
    '2024-03-14T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const formatDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = date.getDate();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // date
    const transactionDate = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(transactionDate, acc.locale);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">₹${mov.toFixed(2)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Main Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `₹${acc.balance.toFixed(2)}`;
};

// Deposits Balance
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `₹${income.toFixed(2)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `₹${Math.abs(out).toFixed(2)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `₹${interest.toFixed(2)}`;
};

// Usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUi = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };

  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event Handlers
let currentAccount, timer;

// // Fake login
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

// Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`Login`);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // Current Date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    inputLoginPin.style.color = inputLoginUsername.style.color = 'red';
  }

  if (timer) clearInterval(timer);
  timer = startLogoutTimer();

  updateUi(currentAccount);
});

inputLoginUsername.addEventListener('keydown', function () {
  if (inputLoginUsername.value === '') {
    inputLoginPin.style.color = inputLoginUsername.style.color = '#444';
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Add current Tranfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// Loan Button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    // Adding the loan amount to the movements
    currentAccount.movements.push(loanAmount);
    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUi(currentAccount);

    Interval(timer);
    timer = startLogoutTimer();

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// Deletion of account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

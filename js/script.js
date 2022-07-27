'use strict';
// Männlichen Bank

// fictional Data
const account1 = {
  owner: 'Billie Eilish',
  movements: [22000, 450, -4252, 385085, -6510, -3130, 70055, 13300],
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-07-22T17:01:17.194Z',
    '2022-07-24T23:36:17.929Z',
    '2022-07-26T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Hans Zimmer',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account3 = {
  owner: 'Elon Musk',
  movements: [43250, 1058500, 788200, -558820, 955750],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  pin: 3333,
  currency: 'ZAR',
  locale: 'en-ZA',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelTimer = document.querySelector('.timer');
const labelBalanceUser = document.querySelector('.balance__user');

const loginWindow = document.querySelector('.login');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.querySelector('.logout__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/* 




*/
/* 
This function will insert the data accordingly
from data objects (which is presented in accounts array)
into the movements window. Also it receives 'sorted' argument which we need 
to have info about user clicked the 'sort'. 


*/

// Function that shows dates of movements in a formated way depending on region
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  /*
  // This was an old way of formtaing movments's dates.
  //  It was not related to user's locale way of representing of dates. 
  // It was only hardcoded US way of showing date
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2, 0);
    return `${day}/${month}/${year}, ${hour}:${min}`;
  }
  */
  // But this time we return a formated way of representing of
  // dates depending on user's location / region
  return new Intl.DateTimeFormat(locale).format(date);
};

// Function that takes the locale and currency from account object which then will
//  be shown in movements
// $8,500 or 33 500€ - formating for different regions from where user logged in
// (not acctualy but as an idea)
const formatedNumbers = function (value, region, currency) {
  return new Intl.NumberFormat(region, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sorted) {
  // Emptying default html
  containerMovements.innerHTML = '';

  // we cant mutate the initial array that comes with account's data
  // thats why we make it's copy by using slice method
  const checkedSortArray =
    sorted == true
      ? account.movements.slice().sort((a, b) => a - b)
      : account.movements;

  checkedSortArray.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // displaying dates that comes from user's data objects
    // saving each date user have in his object inside of each iteration
    const date = new Date(account.movementsDates[i]);
    // then we save foramted date to new var (it will look like this for each iteration:  25/07/2022, 13:51)
    const displayDates = formatMovementDate(date, account.locale);

    // Here we create the html text through object literal which then we will paste
    // into out index.html by method below
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDates}</div>
      <div class="movements__value">${formatedNumbers(
        mov,
        account.locale,
        account.currency
      )}</div>
    </div>
    `;

    // This method inserts html string. 'afterbegin' / 'beforeend'
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/* Function that takes string from ...accounts array... 
  that contains user data
  Then it makes 'js' from 'Jason Statham' 
  and for the rest of users accordingly to thier names.
  This fucntion will create an extra property called username 
  for each user
  And it will contain the first letters of owner's name
*/
const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (array) {
        return array[0];
      })
      .join('');
  });
};

/* Function that summs the movements of cash for every 
account loged in. */
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatedNumbers(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

/* Function that displays total income and total outcome of account's money flow */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(value => value > 0)
    .reduce((accum, value) => accum + value, 0);
  labelSumIn.textContent = `${formatedNumbers(
    incomes,
    acc.locale,
    acc.currency
  )}`;
  const outcomes =
    acc.movements
      .filter(value => {
        return value < 0;
      })
      .reduce((accum, value) => {
        return accum + value;
      }, 0) * -1;
  labelSumOut.textContent = `${formatedNumbers(
    outcomes,
    acc.locale,
    acc.currency
  )}`;
};

const updateUserUI = function (account) {
  // Display logged in user's money flow
  displayMovements(account);
  // Display logged in user' balance
  calcDisplayBalance(account);
  // Display logged in user's summary
  calcDisplaySummary(account);

  displayUserName(account);
};

const displayDate = function (account) {
  // this is an old version of showing date on screen
  /*
  const date = new Date();
  labelDate.textContent = date; // Tue Jul 26 2022 01:17:17 GMT+0300 (Москва, стандартное время)

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, 0);
  const min = `${date.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  // we need to format it to day / month / year 
  */

  // This is a newer version of showing the current time.
  //It depends on user's location which is defined on user's object as local property
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long', //'short' /'narrow'
  };

  const local = account.locale;
  console.log(local); // ru-RU
  labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now); // google iso language code table (pt-PT / en-US)
};

const startLogOutTimer = function () {
  // The bug with this time function is that it does not starts immidiately. So when we set time = 10.
  // It actualy takes 11 seconds. (+1 second before it starts execution)
  // So to fix this bug we need to call it immidiatly when function starts.
  // To do that we just put the execution code inside of outer function which is called tick.
  // then we just call it once. (and it does just makes one pre iteration)
  // then we put it as an argument inside setInteval

  // Another problem which occurs - is that timer does not clears when other user logins
  // basicly we will have two timers runnig at the same time.
  // The solution for this is to return somthing from this function and use it in
  // loggin eventhandler in order to check if old timer is equal or not to 0 seconds

  // getting rid of precompilled text
  labelTimer.textContent = '';
  // setting time to 5 min
  let time = 300;
  // call the timer every second
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const second = String(Math.trunc(time % 60)).padStart(2, '0');

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min} : ${second}`;

    console.log(time);
    // when 0 seconds, stop the timer and logout the current user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    //decrese 1 second
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const displayUserName = function (account) {
  labelBalanceUser.textContent = `Welcome back, ${account.owner}`;
};

// Function triggers
createUserName(accounts);

/* 




*/
//////////////////////----EVENTs--------//////////////////////
/* 
Login event. 
We also need to save the info about the user who is logged in account in a var outside of all functions
Because this var will be requered in other functions. Same thing with timer
*/
let currentAccount, timer;
// faking loggin for developing purposes
/* currentAccount = account1;
updateUserUI(currentAccount);
containerApp.classList.remove('hidden');
loginWindow.classList.add('hidden');
btnLogOut.classList.remove('hidden'); */

// Login to user's account
btnLogin.addEventListener('click', function (event) {
  // We need to prevent page from reloading which happens
  // because btn located in form html.
  // And btn inside of form has a property of reloading the page after it clicked
  event.preventDefault();
  // Saving object to cuurentAccount by using find method
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  // Checking PIN. currentAccount?.pin = same as currentAccount && currentAccount.pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // If we could find the user, and his PIN is correct.
    // We have to show him his UI, with his data.
    /*
     */
    // Changing welcome text to user's name
    /*     
    labelWelcome.textContent = `Logged user: ${
      currentAccount.owner.split(' ')[0]
    } ${currentAccount.owner.split(' ')[1]}
    `; 
    */
    //containerApp.style.opacity = 100;
    containerApp.classList.remove('hidden');
    loginWindow.classList.add('hidden');
    btnLogOut.classList.remove('hidden');
    // Clearing login and pin fileds from typed values
    inputLoginUsername.value = inputLoginPin.value = '';
    // Clearing pin input from idk how to call it... -> | <- this thing
    inputLoginPin.blur();
    displayDate(currentAccount);
    updateUserUI(currentAccount);

    // clearing timer for each time user logs in
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLogOut.addEventListener('click', function () {
  containerApp.classList.add('hidden');
  loginWindow.classList.remove('hidden');
  btnLogOut.classList.add('hidden');
});

// Transfering Money
btnTransfer.addEventListener('click', function (event) {
  // preventing default behavior because it is form
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);

  // Saving receiver's user name to this var. If account username is not found, then it wound be undefined
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  // Checking if user have enought money and other conditions
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);

    receiverAccount.movements.push(amount);
    // add transfter's date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  } else {
    inputTransferAmount.value = '';
  }
  updateUserUI(currentAccount);

  // resetting the timer because transfering money - is an action and shows that user active
  clearInterval(timer);
  // and starting it back again
  timer = startLogOutTimer();
});

// Deleting account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // Checking confirm user.
  // We need to make number converion in pin check cuz form always converts inputs to string
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // looking for an account's index which matches with current's account username
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // deleting account from account's array
    inputClosePin.value = '';
    inputCloseUsername.value = '';
    accounts.splice(index, 1);
    containerApp.classList.add('hidden');
    loginWindow.classList.remove('hidden');
    btnLogOut.classList.add('hidden');
    labelWelcome.textContent = 'Log in to get started';
  } else {
    inputClosePin.value = '';
  }
});

// Loan fuctionality
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // lets immitate the loan request. cuz loan operation requires some time in real world :)
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      inputLoanAmount.value = '';

      // addting loan's date
      currentAccount.movementsDates.push(new Date().toISOString());
      console.log('Loan successfully approved! Sorry for the delay :(');
      updateUserUI(currentAccount);
    }, 2500);
  }
  // resetting the timer because transfering money - is an action and shows that user active
  clearInterval(timer);
  // and starting it back again
  timer = startLogOutTimer();
});

// Sorting functionality
// we need this var in order to sort movements.
let sortedCheck = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sortedCheck);
  // Here is how we fliping a value
  sortedCheck = !sortedCheck;
});

// Extra functionality:
// Here we create a new array from movements array by using new methods
labelBalance.addEventListener('click', function () {
  const newMovementsArr = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(newMovementsArr);
});

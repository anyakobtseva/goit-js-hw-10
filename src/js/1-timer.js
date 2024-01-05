// Описаний в документації
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
const startButton = document.querySelector('[data-start]');
const coundtdownElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const picker = 'input#datetime-picker';
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = Date.parse(selectedDates[0]);
    if (userSelectedDate <= Date.now()) {
      startButton.disabled = true;
      iziToast.error({
        position: 'topRight',
        close: false,
        closeOnClick: true,
        closeOnEscape: true,
        message: 'Please choose a date in the future',
      });
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(picker, options);

startButton.addEventListener('click', async () => {
  let timeDiff;
  while (
    (timeDiff = userSelectedDate - Date.now()) &&
    timeDiff > 0 &&
    new Date(timeDiff).getSeconds() >= 0
  ) {
    updateDateElements(convertMs(timeDiff));
    await delay(1000);
  }
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function updateDateElements(newValues) {
  Object.keys(newValues).forEach(key =>
    coundtdownElements[key]
      ? (coundtdownElements[key].textContent = addLeadingZero(
          newValues[key].toString()
        ))
      : console.log(`Unknown element ${key}`)
  );
}

function addLeadingZero(value) {
  return value.padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

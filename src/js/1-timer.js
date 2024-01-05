// Описаний в документації
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
const startButton = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

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
        backgroundColor: 'red',
        close: false,
        closeOnClick: true,
        closeOnEscape: true,
        message: 'Please choose a date in the future'
      })
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(picker, options);

startButton.addEventListener('click', async () => {
  let timeDiff = userSelectedDate - Date.now();
  updateDateElements(convertMs(timeDiff));
  while (
    (timeDiff = userSelectedDate - Date.now()) &&
    timeDiff > 0 &&
    new Date(timeDiff).getSeconds() >= 0
  ) {
    await timeout(1000).then(() => updateDateElements(convertMs(timeDiff)));
  }
});

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

function updateDateElements(newValues) {
  Object.keys(newValues).forEach(
    key => (newValues[key] = addLeadingZero(newValues[key].toString()))
  );
  days.textContent = newValues.days;
  hours.textContent = newValues.hours;
  minutes.textContent = newValues.minutes;
  seconds.textContent = newValues.seconds;
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

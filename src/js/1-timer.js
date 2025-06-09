import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');
const dateTimePickerElement = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    const selectedDate = selectedDates[0];
    const now = new Date();

    if (!selectedDate || selectedDate < now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
        position: 'topRight',
        color: 'red',
      });

      startButton.disabled = true;
      userSelectedDate = null;
      return;
    }

    startButton.disabled = false;
    userSelectedDate = selectedDate;
    console.log('Selected Date (userSelectedDate):', userSelectedDate);
  },
};

flatpickr('#datetime-picker', options);

const addLeadingZero = value => {
  return String(value).padStart(2, '0');
};

const convertMs = ms => {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
};

const updateTimerDisplay = ({ days, hours, minutes, seconds }) => {
  daysElement.innerText = days;
  hoursElement.innerText = hours;
  minutesElement.innerText = minutes;
  secondsElement.innerText = seconds;
};

const startCountDown = () => {
  startButton.disabled = true;
  dateTimePickerElement.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeDifference = userSelectedDate.getTime() - now.getTime();

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);

      updateTimerDisplay({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });

      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
        position: 'topRight',
        color: 'green',
      });

      dateTimePickerElement.disabled = false;
      return;
    }

    const time = convertMs(timeDifference);
    updateTimerDisplay(time);
  }, 1000); // Update every second
};

startButton.addEventListener('click', startCountDown);

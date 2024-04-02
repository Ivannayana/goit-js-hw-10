import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Оголошення змінних для елементів DOM
const startBtn = document.querySelector('[data-start]');
const daysTime = document.querySelector('[data-days]');
const hoursTime = document.querySelector('[data-hours]');
const minutesTime = document.querySelector('[data-minutes]');
const secondsTime = document.querySelector('[data-seconds]');
const input = document.querySelector('#datetime-picker');

// Обробник події click для кнопки "Start"
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;
  startTimer();
});

// Оголошення змінних для таймера
let timeDifference;
let intervalId;

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,

  // Обробник події закриття календаря
  onClose(selectedDates) {
    const userDate = new Date(selectedDates[0]).getTime();
    const startDate = Date.now();

    // Перевірка, чи вибрана дата у майбутньому
    if (userDate >= startDate) {
      startBtn.disabled = false;
      timeDifference = userDate - startDate;
      updateClockface(convertMs(timeDifference));
    } else {
      // Відображення помилки, якщо вибрана дата у минулому
      iziToast.error({
        fontSize: 'large',
        close: false,
        position: 'topRight',
        messageColor: 'white',
        timeout: 2000,
        backgroundColor: 'red',
        message: 'Please choose a date in the future',
      });
    }
  },
};

// Ініціалізація flatpickr з опціями
flatpickr('#datetime-picker', options);

// Функція для оновлення значень таймера
function updateClockface({ days, hours, minutes, seconds }) {
  daysTime.textContent = `${days}`;
  hoursTime.textContent = `${hours}`;
  minutesTime.textContent = `${minutes}`;
  secondsTime.textContent = `${seconds}`;
}

// Функція для запуску таймера
function startTimer() {
  clearInterval(intervalId);
  intervalId = setInterval(timer, 1000);
}

// Функція таймера
function timer() {
  if (timeDifference > 0) {
    timeDifference -= 1000;
    updateClockface(convertMs(timeDifference));
  } else {
    // Зупинка таймера, якщо досягнутий нуль
    clearInterval(intervalId);
    input.disabled = false;
  }
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини та секунди
function convertMs(time) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(time / day));
  const hours = addLeadingZero(Math.floor((time % day) / hour));
  const minutes = addLeadingZero(Math.floor(((time % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((time % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

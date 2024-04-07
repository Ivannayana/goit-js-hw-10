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

// Оголошення змінних для таймера
let timeDifference;
let intervalId;
let timerStarted = false;

// Обробник події click для кнопки "Start"
startBtn.addEventListener('click', () => {
  if (!timerStarted && timeDifference > 0) {
    // Додано перевірку на те, чи вибрана дата у майбутньому
    startBtn.disabled = true;
    startTimer();
    timerStarted = true;
  }
});

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userDate = new Date(selectedDates[0]).getTime();
    const startDate = Date.now();

    // Перевірка, чи вибрана дата у майбутньому
    if (userDate >= startDate) {
      timeDifference = userDate - startDate;
      updateTimerDisplay(convertMs(timeDifference));
      startBtn.disabled = false;
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
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysTime.textContent = formatTimeValue(days);
  hoursTime.textContent = formatTimeValue(hours);
  minutesTime.textContent = formatTimeValue(minutes);
  secondsTime.textContent = formatTimeValue(seconds);
}

// Функція для запуску таймера
function startTimer() {
  clearInterval(intervalId);
  intervalId = setInterval(timer, 1000);
}

// Функція таймера
function timer() {
  if (timeDifference > 1000) {
    timeDifference -= 1000;
    updateTimerDisplay(convertMs(timeDifference));
  } else {
    updateTimerDisplay(convertMs(0));
    // Зупинка таймера, якщо досягнутий нуль
    clearInterval(intervalId);
    timerStarted = false;
  }
}

// Функція для додавання ведучого нуля
function formatTimeValue(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини та секунди
function convertMs(time) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(time / day);
  const hours = Math.floor((time % day) / hour);
  const minutes = Math.floor(((time % day) % hour) / minute);
  const seconds = Math.floor((((time % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

import iziToast from 'izitoast/dist/js/iziToast';

import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');

  form.addEventListener('submit', event => {
    const delay = Number(form.delay.value);

    event.preventDefault();

    const promise = new Promise((resolve, reject) => {
      if (form.state.value === 'fulfilled') {
        setTimeout(() => {
          resolve(delay);
        }, delay);
      } else if (form.state.value === 'rejected') {
        setTimeout(() => {
          reject(delay);
        }, delay);
      }
    });

    promise
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `✅ Fulfilled promise in ${delay}ms`,
          position: 'topCenter',
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `❌ Rejected promise in ${delay}ms`,
          position: 'topCenter',
        });
      });

    form.reset();
  });
});

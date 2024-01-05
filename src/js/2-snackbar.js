// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
const form = document.querySelector('.form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const delay = event.target.delay.value;
  const state = event.target.state.value;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else if (state === 'rejected') {
        reject(delay);
      }
    }, +delay);
  });
  iziToast.settings({
    timeout: 10000,
    resetOnHover: true,
    icon: null,
    position: 'topRight',
    close: false,
    closeOnClick: true,
    closeOnEscape: true,
  });

  promise
    .then(value => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${value}ms`,
      });
    })
    .catch(error => {
      iziToast.error({
        message: `❌ Rejected promise in ${error}ms`,
      });
    });
});

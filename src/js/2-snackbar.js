import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formElements = document.querySelector('.form');
const delayInputElement = formElements.querySelector('[name="delay"]');
const stateRadioButtons = formElements.elements.state;

const createPromise = ({ delay, state }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
};

formElements.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(delayInputElement.value);
  const selectedState = stateRadioButtons.value;

  createPromise({ delay, state: selectedState })
    .then(delayValue => {
      iziToast.show({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delayValue} ms`,
        position: 'topRight',
        backgroundColor: '#52BE80',
        progressBarColor: '#28B463',
        icon: 'icon-checkmark',
      });
    })
    .catch(delayValue => {
      iziToast.show({
        title: 'Error',
        message: `❌ Rejected promise in ${delayValue} ms`,
        position: 'topRight',
        backgroundColor: '#EC7063',
        progressBarColor: '#E74C3C',
        icon: 'icon-cross',
      });
    })
    .finally(() => {
      formElements.reset();
    });
});

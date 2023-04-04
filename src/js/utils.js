import { Notify } from 'notiflix/build/notiflix-notify-aio';

export { toggleSpinner, checkResponse, showErrorMessage, startSmoothScroll };

function toggleSpinner(spinner) {
  spinner.classList.toggle('is-hidden');
}

function checkResponse(response) {
  if (!response?.length) {
    throw new Error('Sorry, there are no images matching your search query. Please try again.');
  }
}

function showErrorMessage(error) {
  Notify.failure(error.message);
}

function startSmoothScroll(selector) {
  const { height: cardHeight } = document
    .querySelector(`.${selector}`)
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}



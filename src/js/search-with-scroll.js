import '../sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import SearchPixabay from './search-pixabay';

const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loaderEllips: document.querySelector('.loader-ellips'),
};

const searchPixabay = new SearchPixabay();
const galleryModal = new SimpleLightbox('.gallery a');

let totalHitsView = 0;

const debouncedScroll = debounce(onScroll, 300);

refs.formSearch.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  reset();

  searchPixabay.query = e.currentTarget.elements.searchQuery.value;

  if (!searchPixabay.query) {
    Notify.failure('Please enter search parameters.');
    return;
  }

  toggleSpinner();

  const response = await loadImages();

  toggleSpinner();
  refs.formSearch.reset();

  if (!response?.length) {
    return;
  }
  Notify.success(`Hooray! We found ${searchPixabay.totalHits} images.`);

  totalHitsView += response.length;

  window.addEventListener('scroll', debouncedScroll);
}

async function onScroll() {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    if (totalHitsView >= searchPixabay.totalHits) {
      Notify.warning(`We're sorry, but you've reached the end of search results.`);
      window.removeEventListener('scroll', debouncedScroll);
      return;
    }

    toggleSpinner();

    const response = await loadImages();

    totalHitsView += response?.length;
    toggleSpinner();
  }
}

async function loadImages() {
  const resultSearch = await searchPixabay.fetchSearch();

  if (!resultSearch) {
    return;
  }

  renderMarkupGallery(resultSearch);

  galleryModal.refresh();

  searchPixabay.incrementPage();

  return resultSearch;
}

function renderMarkupGallery(items) {
  const galleryMarkup = createMarkupGallery(items);
  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}

function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}

function createMarkupElement({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <a class="photo-card" href="${largeImageURL}">
      <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" width="277.5" height="180"/>
      <ul class="info">
        <li>
          <p class="info-item">
            <b>Likes</b>
          </p>
          <p>${likes}</p>
        </li>
        <li>
          <p class="info-item">
            <b>Views</b>
          </p>
          <p>${views}</p>
        </li>
        <li>
          <p class="info-item">
            <b>Comments</b>
          </p>
          <p>${comments}</p>
        </li>
        <li>
          <p class="info-item">
            <b>Downloads</b>
          </p>
          <p>${downloads}</p>
        </li>
      </ul>
    </a>`;
}

function reset() {
  refs.gallery.innerHTML = '';
  searchPixabay.resetPage();
  totalHitsView = 0;
  window.removeEventListener('scroll', debouncedScroll);
}

function toggleSpinner() {
  refs.loaderEllips.classList.toggle('is-hidden');
}

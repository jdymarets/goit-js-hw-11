import '../sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SearchPixabay from './search-pixabay';

const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  loaderEllips: document.querySelector('.loader-ellips'),
};

const searchPixabay = new SearchPixabay();
const galleryModal = new SimpleLightbox('.gallery a');

let totalHits = 0;

refs.formSearch.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
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
}

async function onLoadMore() {
  const isHits = checkHits();
  if (!isHits) return;

  toggleSpinner();
  await loadImages();
  toggleSpinner();

  startSmoothScroll();
}

async function loadImages() {
  const resultSearch = await searchPixabay.fetchSearch();

  if (!resultSearch) {
    return;
  }

  renderMarkupGallery(resultSearch);

  galleryModal.refresh();

  refs.loadMore.classList.remove('is-hidden');

  searchPixabay.incrementPage();

  return resultSearch;
}

function checkHits() {
  totalHits += 40;

  if (totalHits >= searchPixabay.totalHits) {
    hiddenBtnLoadMore();
    Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return false;
  }

  return true;
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

function hiddenBtnLoadMore() {
  refs.loadMore.classList.add('is-hidden');
}

function reset() {
  refs.gallery.innerHTML = '';
  searchPixabay.resetPage();
  totalHits = 0;
  hiddenBtnLoadMore();
}

function startSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function toggleSpinner() {
  refs.loaderEllips.classList.toggle('is-hidden');
}

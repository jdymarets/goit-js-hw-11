import '../sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SearchPixabay from './search-pixabay';
import { toggleSpinner, checkResponse, showErrorMessage, startSmoothScroll } from './utils';
import renderMarkupGalleryPage from './render-gallery-page';

const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  spinner: document.querySelector('.loader-ellips'),
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

  toggleSpinner(refs.spinner);

  const response = await loadImages();

  toggleSpinner(refs.spinner);

  e.target.reset();

  if (!response?.length) {
    return;
  }
  Notify.success(`Hooray! We found ${searchPixabay.totalHits} images.`);
}

async function onLoadMore() {
  const isHits = checkHits();
  if (!isHits) return;

  toggleSpinner(refs.spinner);
  await loadImages();
  toggleSpinner(refs.spinner);

  startSmoothScroll('gallery');
}

async function loadImages() {
  try {
    const resultSearch = await searchPixabay.fetchSearch();

    checkResponse(resultSearch);

    renderMarkupGalleryPage(resultSearch, refs.gallery);

    galleryModal.refresh();

    refs.loadMore.classList.remove('is-hidden');

    searchPixabay.incrementPage();

    return resultSearch;
  } catch (error) {
    showErrorMessage(error);
    return;
  }
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

function hiddenBtnLoadMore() {
  refs.loadMore.classList.add('is-hidden');
}

function reset() {
  refs.gallery.innerHTML = '';
  searchPixabay.resetPage();
  totalHits = 0;
  hiddenBtnLoadMore();
}

function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}
import '../sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import SearchPixabay from './search-pixabay';
import { toggleSpinner, checkResponse, showErrorMessage, startSmoothScroll } from './utils';
import renderMarkupGalleryPage from './render-gallery-page';

const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  spinner: document.querySelector('.loader-ellips'),
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

  toggleSpinner(refs.spinner);

  const response = await loadImages();

  toggleSpinner(refs.spinner);
  e.target.reset();

  if (!response?.length) {
    return;
  }
  Notify.success(`Hooray! We found ${searchPixabay.totalHits} images.`);

  totalHitsView += response.length;

  window.addEventListener('scroll', debouncedScroll);
}

async function onScroll() {
  if (window.scrollY + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
    if (totalHitsView >= searchPixabay.totalHits) {
      Notify.warning(`We're sorry, but you've reached the end of search results.`);
      window.removeEventListener('scroll', debouncedScroll);
      return;
    }

    toggleSpinner(refs.spinner);

    const response = await loadImages();

    totalHitsView += response?.length;
    toggleSpinner(refs.spinner);
    startSmoothScroll('gallery');
  }
}

async function loadImages() {
  try {
    const resultSearch = await searchPixabay.fetchSearch();

    checkResponse(resultSearch);

    renderMarkupGalleryPage(resultSearch, refs.gallery);

    galleryModal.refresh();

    searchPixabay.incrementPage();

    return resultSearch;
  } catch (error) {
    showErrorMessage(error);
    return;
  }
}

function reset() {
  refs.gallery.innerHTML = '';
  searchPixabay.resetPage();
  totalHitsView = 0;
  window.removeEventListener('scroll', debouncedScroll);
}

function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}

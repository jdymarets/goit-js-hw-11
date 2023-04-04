import 'regenerator-runtime/runtime';
import axios from 'axios';

export default class SearchPixabay {
  #KEY = '25076946-406015110a75827c7826516f1';
  #BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async fetchSearch() {
    const paramsFetch = new URLSearchParams({
      key: this.#KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });

    const response = await axios.get(`${this.#BASE_URL}?${paramsFetch}`);
    const { hits, totalHits } = response.data;
    this.totalHits = totalHits;

    return hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}
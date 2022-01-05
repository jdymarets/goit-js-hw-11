import createMarkupElement from './template-card';

export default function renderMarkupGalleryPage(items, galleryContainer) {
  const galleryMarkup = createMarkupGallery(items);
  galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
}

function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}

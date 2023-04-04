export default function createCard({
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


function createMarkupGallery(items) {
  return items.map(createMarkupElement).join('');
}
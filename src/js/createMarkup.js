import { refs } from "./refs";

export function createMarkup(photos) {
  const markup = photos
    .map(({ webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads, }) => {
      return `
<div class="photo-card">
<a href="${webformatURL}" clas="photo-card__link">
  <img src="${largeImageURL}" alt="${tags}" loading="lazy"  width='270' height='170' />
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
 `;
    })
    .join('');
   
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
};


import './css/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { PixabayAPI } from './js/API';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayAPI();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
  overlayOpacity: 0.9,
  nav: true,
});
console.log(lightbox);

async function handleSubmit(event) {
  event.preventDefault();
  // console.log(event);
  const {
    elements: { searchQuery },
  } = event.target;
  const query = searchQuery.value.trim().toLowerCase();
  // console.log(query);

  if (!query) {
    Notify.failure('Enter the search data');
    return;
  }
  pixabay.query = query;
  // console.log(pixabay);

  clearPage();

  try {
    const { hits, total } = await pixabay.getPhotos();

    if (hits.length === 0) {
      Notify.info(`Sorry, there are no images matching your search query. Please try again.
`);
      return;
    }

    createMarkup(hits);

    pixabay.calculateTotalPages(total);

    Notify.success(`Hooray! We found ${total} images.`);
    lightbox.refresh();

    if (pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong');
    clearPage();
  }
}

refs.searchForm.addEventListener('submit', handleSubmit);

async function onLoadMore() {
  console.log(pixabay);
  pixabay.incrementPage();
  console.log(pixabay);

  try {
    const { hits } = await pixabay.getPhotos();
    createMarkup(hits);
    smoothlyScroll()
    lightbox.refresh();
    if (!pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearPage();
  }
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.galleryContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}


function smoothlyScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

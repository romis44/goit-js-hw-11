import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPhotos } from './fetchPhotos';

const searchForm = document.querySelector('#search-form');
const galleryMarkup = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

loadMoreBtn.style.display = 'none';

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let totalHits = 0;

function cleanPage() {
  galleryMarkup.innerHTML = '';
}

async function onSubmit(evt) {
  evt.preventDefault();
  cleanPage();

  currentPage = 1;

  const dataBase = await fetchPhotos(searchForm, currentPage);

  totalHits = dataBase.hits.length;

  if (!totalHits) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.style.display = 'none';
    return;
  }

  const markup = onMarkup(dataBase.hits);
  galleryMarkup.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  onLoadMoreBtnCheck(totalHits, dataBase);
}

function onMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" height="250" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`;
      }
    )
    .join('');
}
async function onLoadMore() {
  currentPage += 1;
  const dataBase = await fetchPhotos(searchForm, currentPage);
  const markup = onMarkup(dataBase.hits);
  galleryMarkup.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  totalHits += dataBase.hits.length;
  onLoadMoreBtnCheck(totalHits, dataBase);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onLoadMoreBtnCheck(step, value) {
  if (`${step}` === `${value.totalHits}`) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

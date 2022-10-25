import ApiService from './api-services';
import cardTemplate from '../card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  apiService.searchName = event.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();
  apiService.fetchArticles().then(({ hits, totalHits }) => {
    clearGalleryContainer();
    addArticles(hits);
    lightbox.refresh();

    if (apiService.searchName === '') {
      return Notiflix.Notify.failure('Oops... Please enter the text');
    } else if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);

    apiService.calcTotalPages(totalHits);
    if (apiService.isShowLoadMoreBtn) {
      removeClassHidden();
    }
  });
}

function onLoadMore() {
  apiService.fetchArticles().then(({ hits }) => {
    if (!apiService.isShowLoadMoreBtn) {
      addClassHidden();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    addArticles(hits);
    lightbox.refresh();
  });
}

function addArticles(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', cardTemplate(hits));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function addClassHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function removeClassHidden() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

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
  
    apiService.searchName = event.currentTarget.elements.searchQuery.value;
    apiService.resetPage();
    apiService.fetchArticles().then(({ hits, totalHits }) => {
   
    if (apiService.searchName === '') {
     return Notiflix.Notify.failure('Oops... Please enter the text');
    } else if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }
     Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
    addClassHidden();
    removeClassHidden();
    clearGalleryContainer();
    addArticles(hits);
    lightbox.refresh();
  });
}

function onLoadMore() {
  const total = document.querySelectorAll('.photo-card').length;

  apiService.fetchArticles().then(({ hits, totalHits}) => {
    if (total >= totalHits) {
       Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      addClassHidden();
    }
    addArticles(hits);
    lightbox.refresh();
  })
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
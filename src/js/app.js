import ApiService from './api-services';
import compiledTemplate from '../card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMorBtn: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMorBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
    event.preventDefault();

    clearGalleryContainer();
    apiService.searchName = event.currentTarget.elements.searchQuery.value;
    apiService.resetPage();
    apiService.fetchArticles().then(addArticles);
}

function onLoadMore() {
    apiService.fetchArticles().then(({ hits, totalHits }) => {
    
    if (apiService.searchName === '') {
      Notiflix.Notify.failure('Oops... Please enter the text');
    } else if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
    clearGalleryContainer();
    addArticles(hits);
    lightbox.refresh();
  });
}

function addArticles(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', compiledTemplate(hits));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
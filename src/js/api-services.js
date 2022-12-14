import axios from 'axios/dist/axios.min.js';
const API_KEY = '30579822-7048314e53034861817646057';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.name = '';
    this.API_KEY = API_KEY;
    this.BASE_URL = BASE_URL;
    this.page = 1;
    this.per_page = 40;
    this.totalPages = 0;
  }

  async fetchArticles(page) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}?key=${this.API_KEY}&q=${this.name}&image_type=photo&orientation=horizontal&page=${this.page}&per_page=${this.per_page}`
      );
      const articles = await response.data;
      this.incrementPage();
      return articles;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get searchName() {
    return this.name;
  }

  set searchName(newName) {
    this.name = newName;
  }

  calcTotalPages(totalHits) {
    this.totalPages = Math.ceil(totalHits / this.per_page);
  }

  get isShowLoadMoreBtn() {
    return this.page <= this.totalPages;
  }
}

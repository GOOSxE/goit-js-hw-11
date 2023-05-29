// *
import axios from "axios";
const URL = 'https://pixabay.com/api/';
const API_KEY = '36723883-919c3de6b45800de9c777a63e';

// ? // Експортований клас з асинхронною функцією, 
// ? що робить фетч за допомого axios,
// ? та повертає проміс з потрібними даними ;
export default class ImageApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  async fetchImages() {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image-type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    this.incrementPageNumber()
    return data;
  }
  resetPageNumber() {
    this.page = 1;
  }
  incrementPageNumber() {
    this.page += 1;
  }
}

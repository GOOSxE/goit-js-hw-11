// *
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageApiService from './imageAPIservice';
// ? // Посилання
const formInputUrl = document.getElementById('search-form');
const outputListUrl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
// ? // Створення екземпляру класу ;
const imageApiService = new ImageApiService();
// ? // Додаю слухач submit ;
formInputUrl.addEventListener('submit', onFormSubmit);

// ? // Асинхронна функція, що робить фетч при сабміті форми,
// ? і повідомляє користувача, якщт щось пішло не так ;
async function onFormSubmit(event) {
  event.preventDefault();
  const value = event.target.searchQuery.value.trim();
  if (value === '') {
    Notify.warning('Input can not be empty!');
    return;
  } else {
    resetOtputDiv();
    imageApiService.resetPageNumber();
    try {
      imageApiService.searchQuery = value;
      const data = await imageApiService.fetchImages();
      if (data.length === 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.',
          2000
        );
        return;
      } else {
        renderPhotoCard(data);
        enableLoadMoreBtn();
      }
    } catch (error) {
      Notify.failure('Oops, something got wrong, try to reboot page!', 2000);
      console.log(error);
    }
  }
}
// ? // Асинхронна функція що завантажує більше результатів,
// ? Та повідомляє якщо користувач дійшов до кінця колекції ;
async function LoadMore() {
  try {
    const data = await imageApiService.fetchImages();
    if (data.length === 0 || data.length < 40) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    } else {
      renderPhotoCard(data);
    }
  } catch (error) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      2000
    );
    console.log(error);
  }
}
// ? // Функція що рендерить картки на сторінку ;
function renderPhotoCard(data) {
  outputListUrl.insertAdjacentHTML(
    'beforeend',
    data
      .map(
        ({
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<li class="photo-card">
        <div class="photo-card__img-thumb">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__img"/>
        </div>
        <div class="photo-card__info">
          <p class="photo-card__info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="photo-card__info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="photo-card__info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="photo-card__info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </li>`;
        }
      )
      .join('')
  );
}
// ? // Функція що робить кнопку "Load more" активною,
// ? і додає на неї слухач кліку ;
function enableLoadMoreBtn() {
  loadMoreBtn.addEventListener('click', LoadMore);
  loadMoreBtn.removeAttribute('disabled');
}
// ? // Функція збросу галереї ;
function resetOtputDiv() {
  outputListUrl.innerHTML = '';
}

// todo // Simple Light Box, Infinit Scroll ; 
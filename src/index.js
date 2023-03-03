// Загружаємо бібліотеки через термінал//
// $ npm i notiflix
// $ npm install axios
// $ npm install simplelightbox

import Notiflix from 'notiflix'; // для сповіщень
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const MY_API_KEY = '33995663-3283b38da6c47940fd5e67885'; // мій персональний ключ з pixabay
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let PHOTO_NAME ="";
let stopPage = 1;
// Підключаємось до данних сторінки index.html
const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'), 
};

// -------------------------------------------------------------

refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку load-more
// refs.btnLoadMore.addEventListener('click', loadMore); // Відслідковуваємо подію на кнопці load-more
refs.form.addEventListener('submit', onFormSubmit); // Відслідковуваємо подію submit




// ФУНКЦІЯ - перевіряємо наявність зображень
function onFormSubmit (evt){
    
    evt.preventDefault(); // відміна перезавантаження сторінки
    const name = refs.input.value.trim(); // редагуємо текст, прибираємо пробіли
    PHOTO_NAME = name;
    totalHits = 0;
    refs.gallery.innerHTML = ''; // очищення попереднього вмісту галереї
    page = 1;
    
    // якщо слово пошука НЕ пуста строка то:
    if (name !== '') {
        
        pixabay(name, page); // отримати зображення

    } else {

        // вивести повідомлення про те, що НЕ знайдено жодного зображення
        return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
        ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
        );
    }

};






// ФУНКЦІЯ - отримання зображень з https://pixabay.com
async function pixabay(name, page) {

            // параметри запиту на бекенд
            const options = {
                params: {
                key: MY_API_KEY, // мій персональний ключ з pixabay
                q: name,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                page: page,
                per_page: 40,
                },
            };

     if (stopPage > page || page === 1){
        try {

            // отримання відповіді-результату від бекенду
            const response = await axios.get(BASE_URL, options);
            totalHits = response.data.total;
            console.log(`totalHits for "${name}" : ${response.data.total}`); // TEST
            stopPage = Math.round(response.data.total /40);
            console.log(stopPage);
            console.log(page);
            // ПОВІДОМЛЕННЯ - Після першого запиту з кожним новим пошуком 
            if ( page === 1) {
                Notiflix.Notify.success(
                    `Hooray! We found ${response.data.total} images.`
                    ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
                    );
            };

                createMarkup(response.data.hits);// рендер розмітки на сторінку

        } catch (error) {
            console.log(error);
        }

    }else if  (stopPage === page || stopPage === 0) {
        return Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
        ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
        );
        
    };


      
}

// ФУНКЦІЯ - створення карток з зображеннями

function createMarkup (stock){

 const imgStock = stock.map( item => 
    `<div class="photo-card">
        <div class="photo">
        <a href="${item.largeImageURL}">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" class="images"/>
        </a>
        </div>
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>
        ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${item.downloads}
      </p>
    </div>
  </div>`)
  .join(''); // сполучення рядків всіх об'єктів (всіх картинок)
  
  refs.gallery.insertAdjacentHTML('beforeend', imgStock); // вставлення розмітки на сторінку
  simpleLightBox.refresh() // Бібліотека містить метод refresh(), який обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.


  // ПЕРЕВІРКА - на кнопку Load more 
    // if (stock.length === 40) {
    //     refs.btnLoadMore.style.display = 'flex'; // показуємо кнопку Load more 
    // }else if (stock.length === 0){
    //     refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку Load more 
    //     return Notiflix.Notify.failure(
    //         `Sorry, there are no images matching your search query. Please try again.`
    //         ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
    //         );
    // }else if (stock.length > 1 || stock.length < 40 ){
    //     refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку Load more 
    //     return Notiflix.Notify.info(
    //         `We're sorry, but you've reached the end of search results.`
    //         ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
    //         );
    // }
}


// ФУНКЦІЯ - на кнопку Load more 
// function loadMore (){
//     refs.btnLoadMore.style.display = 'none'; // ТЗ - При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
//     pixabay(PHOTO_NAME, page++);

// }

// НАЛАШТУВАННЯ - Слайдер зображень SimpleLightbox
const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', // опис
    captionDelay: 250, // затримка 250 мілісекунд
    overlayOpacity: 0.5, // затемнення заднього фону
  });


//   Нескінченний скрол
window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    page++;
    pixabay(PHOTO_NAME, page);
  }
})

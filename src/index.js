// Загружаємо бібліотеки через термінал//
// $ npm i notiflix
// $ npm install axios

import Notiflix from 'notiflix'; // для сповіщень
import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const MY_API_KEY = '33995663-3283b38da6c47940fd5e67885'; // мій персональний ключ з pixabay
const BASE_URL = 'https://pixabay.com/api/';
// Підключаємось до данних сторінки index.html
const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    imageBox: document.querySelector('.image-box'),
};

console.log(refs.formInput); // TEST
console.log(refs.formSubmit); // TEST
console.log(refs.imageBox); // TEST
console.log(`test 1`);

// -------------------------------------------------------------


// Відслідковуваємо подію submit
refs.form.addEventListener('submit', onFormSubmit);


// ФУНКЦІЯ - перевіряємо наявність зображень
function onFormSubmit (evt){
    evt.preventDefault(); // відміна перезавантаження сторінки
    const name = refs.input.value.trim(); // обрізання пробілів до і після слова
    console.log(name);

    // якщо слово пошука НЕ пуста строка то:
    if (name !== '') {
        pixabay(name); // отримати зображення

    } else {
        // refs.btnLoadMore.style.display = 'none';

        // вивести повідомлення про те, що НЕ знайдено жодного зображення
        return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
        ,{width:'350px', borderRadius: '10px', position: 'center-center',clickToClose: true, useIcon: false,}
        );
    }


};




// отримання зображень з https://pixabay.com
async function pixabay(name, page) {
    console.log(`test 2`);
    // параметри запиту на бекенд
    // const options = {
    //   params: {
    //     key: MY_API_KEY, // мій персональний ключ з pixabay
    //     q: name,
    //     image_type: 'photo',
    //     orientation: 'horizontal',
    //     safesearch: 'true',
    //     page: page,
    //     per_page: 40,
    //   },
    // };

    const imgSerch = "https://pixabay.com/api/?key=" + MY_API_KEY+"&q="+name;
    $.getJSON(URL, function(data){
    if (parseInt(data.totalHits) > 0){
        console.log(imgSerch);
    }else{
        console.log('No hits');}
    });

    console.log(imgSerch);
};

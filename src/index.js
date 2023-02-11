import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let page = 1;
let querySearch = '';
const per_page = 40;

const URL = 'https://pixabay.com/api/';
const API_KEY = '33429969-7270757d2f41ebfedf0bcc7cb';

 async function getImg(name, page = 1, per_page = 40) { 
  const res = axios.get(`${URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
  return await res;
    
}

searchForm.addEventListener ('submit', onSearchImg);
async function onSearchImg(e) {
    e.preventDefault();
   let querySearch = searchForm.elements.searchQuery.value.trim();
    page = 1;
    clearMarkup();
    if (!querySearch) {
        Notiflix.Notify.failure('Please, fill search field');
        clearMarkup();
        addHidden();
        return;
      }
    try {
        const res = await getImg(querySearch, page);
        console.log(res);
       let totalPage = res.data.totalHits;
        if (totalPage === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          clearMarkup();
          addHidden();
          return;
        }
         
    renderMarkup(res.data.hits);
        Notiflix.Notify.success(`Hooray! We found ${totalPage} images.`);
        addVisible();
        onSimpleLightBox();
      } catch (error) {
        console.log(error);
      }
}
loadBtn.addEventListener('click', onLoadMoreBtn);
async function onLoadMoreBtn(e) {
    page += 1;
    let querySearch = searchForm.elements.searchQuery.value.trim();
    try {
     
      const res = await getImg(querySearch, page);
      renderMarkup(res.data.hits);
      addVisible();
      const count = res.data.totalHits / per_page;
      if (page > count) {
        Notiflix.Notify.info('Were sorry, but you ve reached the end of search results.');
        addHidden();
        form.reset();
      }
  
    }
    catch (error) {
      console.log(error)
    }
    
  }
  function onSimpleLightBox() {
    new SimpleLightbox('.gallery a', {
          captionDelay: 250,
          captionsData: 'alt',
        }).refresh();
  }
function clearMarkup() {
    gallery.innerHTML = "";
  }
  function addHidden() { 
    loadBtn.classList.remove('visible')
    loadBtn.classList.add('hidden')
  
  }
  function addVisible() { 
    loadBtn.classList.remove('hidden')
    loadBtn.classList.add('visible')
  }
  
 function renderMarkup(pictures) {
  const markup = pictures.reduce((acc, { webformatURL, tags, largeImageURL, likes, views, comments, downloads }) => {
    return acc + `
      
   <div class="gallery-item">
   <a class="gallery__link" href="${largeImageURL}">
   <div class = "item">
    <img  src="${webformatURL}" alt="${tags}" loading="lazy" width = "200"/>
    </div></a> 
    <div class="info">
        <p class="info-item"><span>${likes}</span>
            <b>Likes</b>
        </p>
        <p class="info-item"><span>${views}</span>
            <b>Views</b>
        </p>
        <p class="info-item"><span>${comments}</span>
            <b>Comments</b>
        </p>
        <p class="info-item"><span>${downloads}</span>
            <b>Downloads</b>
        </p>
   </div>
</div>`}, '')

    return gallery.insertAdjacentHTML('beforeend', markup)
}


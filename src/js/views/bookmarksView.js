// import View from './View.js';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();

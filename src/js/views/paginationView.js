import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const prevButtonMarkup = `
    <button class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
    const nextButtonMarkup = `
    <button class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return nextButtonMarkup;
    }
    // Last Page
    if (curPage === numPages && numPages > 1) {
      return prevButtonMarkup;
    }
    // Other Page
    if (curPage < numPages) {
      return `${prevButtonMarkup}${nextButtonMarkup}`;
    }
    // Page 1, and there are no other pages
    return '';
  }
}

export default new PaginationView();

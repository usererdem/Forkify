import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Adds an event listener to the parent element to handle clicks on child elements with class 'btn--inline'
   * @param {function} handler - The function to be called when a button is clicked. Accepts the page number to navigate to as an argument.
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      
      handler(goToPage);
    })
  }

  /**
   * Generates the markup for pagination buttons based on current page number and total number of pages.
   * @returns {string} The markup for the pagination buttons.
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const prevButtonMarkup = `
    <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
    const nextButtonMarkup = `
    <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
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

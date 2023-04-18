class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    // Touch zoom fix on mobile device
    this._parentEl.addEventListener('touchstart', function(event) {
      event.preventDefault();
    }, { passive: false });
    this._parentEl.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });

    this._parentEl.addEventListener('submit', function(e) {
      e.preventDefault();
      handler();
    })
  }
}

export default new SearchView();
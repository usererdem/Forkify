import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// Polyfilling everything else
import 'core-js/stable';
// Polyfilling async/await
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

function controlPagination(goToPage) {
  // 1) Render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
}

function init() {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();
// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

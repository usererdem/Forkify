import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

// Polyfilling everything else
import 'core-js/stable';
// Polyfilling async/await
import 'regenerator-runtime/runtime';

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
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
}

function init() {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults)
}
init();
// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

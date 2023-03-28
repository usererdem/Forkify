import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Polyfilling everything else
import 'core-js/stable';
// Polyfilling async/await
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
}

function init() {
  recipeView.addHandleRender(controlRecipes);
}
init();
// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

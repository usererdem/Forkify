import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Creates a recipe object from the provided data
 * @param {Object} data - The data object containing recipe information
 * @returns {Object} - The recipe object with the following properties:
 * @property {number} id - The ID of the recipe
 * @property {string} title - The title of the recipe
 * @property {string} publisher - The publisher of the recipe
 * @property {string} sourceUrl - The source URL of the recipe
 * @property {string} image - The URL of the recipe's image
 * @property {number} servings - The number of servings for the recipe
 * @property {number} cookingTime - The cooking time in minutes for the recipe
 * @property {Array} ingredients - An array of ingredient objects for the recipe
 * @property {string} key - Optional key for the recipe if it exists
 * @memberof module:model
 */
function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingrediendts: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

/**
 * Loads a recipe from the API and creates a recipe object.
 * @async
 * @param {string} id - The id of the recipe to be loaded.
 * @throws {Error} If an error occurs while loading the recipe.
 * @returns {Promise<void>} A Promise that resolves with no value once the recipe has been loaded and created.
 * @memberof module:model
 */
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(err);
    throw err;
  }
}

/**
 * Loads search results based on the given query.
 * @async
 * @param {string} query - The search query.
 * @throws {Error} When an error occurs while fetching data.
 * @returns {Promise<void>} A Promise that resolves after the search results have been loaded and stored in the state.
 * @memberof module:model
 */
export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Returns a specified page of search results based on the current page number
 * and the number of results per page stored in the state.
 * @param {number} [page=1] - The page number to retrieve, defaults to 1.
 * @returns {Object[]} - An array of search result objects representing the requested page.
 */
export function getSearchResultsPage(page = 1) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
}

/**
 * Updates the number of servings in the current recipe object and adjusts ingredient quantities accordingly.
 * @param {number} newServings - The new number of servings to update the recipe with.
 * @returns {void}
 */
export function updateServings(newServings) {
  state.recipe.ingrediendts.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQuantity = oldQuantity * newServings / oldServings
  });

  state.recipe.servings = newServings;
}

/**
 * Persists the bookmarks in the localStorage by converting the state.bookmarks array to JSON string and saving it under the key 'bookmarks'
 */
function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

/**
 * Add a recipe to bookmarks.
 * @param {Object} recipe - The recipe to be added to bookmarks.
 * @returns {undefined}
 */
export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

/**
 * Deletes a bookmark with the given ID from the state.bookmarks array and updates the persisted bookmarks in localStorage.
 * @param {string} id - The ID of the bookmark to be deleted.
 * @returns {void}
 */
export function deleteBookmark(id) {
  // Delete bookmark from bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();

function clearBookmarks() {
  localStorage.clear('bookmarks');
}
//clearBookmarks();

/**
 * Uploads a new recipe to the API and adds it to the state and bookmarks.
 *
 * @param {Object} newRecipe - The new recipe object to be uploaded.
 * @throws {Error} Will throw an error if an ingredient is in the wrong format.
 * @returns {void}
 */

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

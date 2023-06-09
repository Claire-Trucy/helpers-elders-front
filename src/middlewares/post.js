/* eslint-disable max-len */
import axios from 'axios';
import { displayInfoMessages, redirectAction } from '../actions/app';
import { createPostFormClear, createPostThrowErrors, SUBMIT_NEW_POST } from '../actions/createpostform';
import { baseUrl, getHttpAuthHeaders } from '../utils/api';
import { getPost, LOAD_POST } from '../actions/detailedpost';
import { getFilteredPosts, SEARCH_POSTS } from '../actions/resultposts';
import errorManagement from './errorManagement';
import { loadReviews } from '../actions/review';

const postMiddleware = (store) => (next) => (action) => {
  const { adressInput, selectedServices, postType } = store.getState().searchbar;

  // filter functions
  function filterByZipcode(post) {
    if (adressInput === '') return true;
    if (adressInput.slice(0, 2) === 97) return adressInput.slice(0, 3) === post.postalCode.slice(0, 3);
    return adressInput.slice(0, 2) === post.postalCode.slice(0, 2);
  }

  function filterByServices(post) {
    if (selectedServices.length === 0) return true;
    if (postType === 'offer') {
      const tagsAsInt = post.tag.map((tag) => tag.id);
      return selectedServices.every((service) => tagsAsInt.includes(service));
    }
    return post.tag.every((service) => selectedServices.includes(service.id));
  }

  function searchUrl() {
    if (postType === 'offer') return 'aidant';
    if (postType === 'request') return 'recherche-aide';
    return false;
  }

  switch (action.type) {
    case SEARCH_POSTS:
      axios.get(
        // URL
        `${baseUrl}/annonce/${searchUrl()}`,
      )
        .then((response) => {
          const arrayPostsFilter = response.data.filter(filterByServices).filter(filterByZipcode);
          store.dispatch(getFilteredPosts(arrayPostsFilter));
        })
        .catch((error) => {
          console.log(error);
          errorManagement(error.response.status, store);
        });
      break;

    case LOAD_POST:
      axios.get(
        // URL
        `${baseUrl}/annonce/${action.id}`,
      )
        .then((response) => {
          store.dispatch(getPost(response.data));
          if (store.getState().authentication.user !== null) {
            store.dispatch(loadReviews(response.data.user.id));
          }
        })
        .catch((error) => {
          console.log(error);
          errorManagement(error.response.status, store);
        });
      break;

    case SUBMIT_NEW_POST:
      axios.post(
        // URL
        `${baseUrl}/annonce/ajouter`,
        // data
        action.post,
        // header
        getHttpAuthHeaders(store.getState().authentication.jwt),
      )
        .then((response) => {
          if (response.status !== 201) {
            console.log('post creation failed');
          }
          else {
            store.dispatch(createPostFormClear());
            store.dispatch(redirectAction('/'));
            store.dispatch(displayInfoMessages(['Annonce créée avec succès !']));
          }
        })
        .catch((error) => {
          console.log(error);
          if (!errorManagement(error.response.status, store)) store.dispatch(createPostThrowErrors('La création d\'annonce a échoué'));
        });
      break;
    default:
  }
  next(action);
};
export default postMiddleware;

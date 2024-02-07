const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = '0e6d860fdb93125a12911f42a73dd701'
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500/'

const _fetch = (path, query) => {
  return window.fetch(`${API_URL + path}?api_key=${API_KEY}&language=ko&${query}`)
    .then(res => res.json())
}

export const tmdb = {
  API_URL,
  API_KEY,
  BASE_IMAGE_URL,

  // https://developers.themoviedb.org/3/trending/get-trending
  getTrending ({ media_type = 'movie', time_window = 'week' } = {}) {
    return _fetch(`/trending/${media_type}/${time_window}`)
  },

  // https://api.themoviedb.org/3/movie/popular
  getPopularMovie () {
    return _fetch('/movie/popular')
  },

  // https://developers.themoviedb.org/3/discover/movie-discover
  getGenre (id) {
    return _fetch('/discover/movie', `sort_by=popularity.desc&region=KR&with_genres=${id}`)
  },

  // https://developers.themoviedb.org/3/movies/get-movie-details
  getMovieDetails (id) {
    return _fetch(`/movie/${id}`, 'append_to_response=similar,videos')
  },

  // https://api.themoviedb.org/3/movie/{id}
  getVideo (id) {
    return window.fetch(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}`)
  }
}

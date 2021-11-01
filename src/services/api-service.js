import axios from 'axios';



class MovieApiService {
    constructor() {
        this.KEY = 'ac85e0580bfc64493b2efcb6b44eda28';
        this.BASE_URL = 'https://api.themoviedb.org/3/';
    }
    
    async fetchTrendingMovies(page) {
        const url = `${this.BASE_URL}trending/movie/day?page=${page}&api_key=${this.KEY}`;
        const response = await axios.get(url);
        return response;
    }

    async fetchMovie(searchQuery, page) {
        const url = `${this.BASE_URL}search/movie?api_key=${this.KEY}&page=${page}&query=${searchQuery}&include_adult=false`;
        const response = await axios.get(url);
        return response;
    }

    async fetchSingleFilm(filmId) {
        const url = `${this.BASE_URL}movie/${filmId}?api_key=${this.KEY}`;
        const response = await axios.get(url);
        return response;
    }

    async fetchCast(filmId) {
        const url = `${this.BASE_URL}movie/${filmId}/credits?api_key=${this.KEY}`;
        const response = await axios.get(url);
        return response;
    }

    async fetchReviews(filmId) {
        const url = `${this.BASE_URL}movie/${filmId}/reviews?api_key=${this.KEY}&page=1`;
        const response = await axios.get(url);
        return response;
    }


    
    // incrementPage() {
    //     this.page += 1;
    // }

    // resetPage() {
    //     this.page = 1;
    // }

    // get query() {
    //     return this.searchQuery;
    // }

    // set query(newQuery) {
    //     this.searchQuery = newQuery;
    // }
};

const movieApiService = new MovieApiService();

export default movieApiService;
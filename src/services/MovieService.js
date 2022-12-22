import axios from "axios"

export default class MovieService{
    url = "https://localhost:7072/api/v1/MovieEntity/"
    customConfig = {
        headers: {
        'Content-Type': 'application/json'
        }
    };
    getMovies(){
        const params = JSON.stringify({
            "page": 0,
            "pageSize": 10,
            "filters": []
          });
     return axios.post(this.url + "GetTableAsync", params, customConfig);
    }

    getMovieByTitle(title){
        const params = JSON.stringify({"title": title});
     return axios.post(this.url + "GetTableByTitleAsync", params, customConfig);
    }

    getMovieByReleaseYear(releaseYear){
        const params = JSON.stringify({"releaseYear": releaseYear});
     return axios.post(this.url + "GetTableByReleaseYearAsync", params, customConfig);
    }
    
    add(movie){
        return axios.post(this.url, movie)
    }
}
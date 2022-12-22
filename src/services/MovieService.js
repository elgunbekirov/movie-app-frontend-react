import axios from "axios"

export default class MovieService{
    url = "https://localhost:7072/api/v1/MovieEntity/GetTableAsync"

    getMovies(){
        const params = JSON.stringify({
            "page": 0,
            "pageSize": 10,
            "filters": []
          });
        const customConfig = {
            headers: {
            'Content-Type': 'application/json'
            }
        };
     return axios.post(this.url, params, customConfig);
    }

    getMovieByName(id){
        return axios.get(this.url+"/"+id)
    }
    
    add(movie){
        return axios.post(this.url, movie)
    }
}
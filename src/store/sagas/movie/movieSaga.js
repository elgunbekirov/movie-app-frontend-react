import axios from "axios"
import {call, put} from "redux-saga/effects"
import { setMovies } from "../../actions/movieActions";


async function getMovies(){
    try {
        const params = JSON.stringify({
            "page": 0,
            "pageSize": 10,
            "filters": []
          });
        const customConfig = {
            headers: {
            'accept' : 'application/json',     
            'Content-Type': 'application/json'
            }
        };
         const {data} = await axios.post("https://localhost:7072/api/v1/MovieEntity/GetTableAsync", params, customConfig);
         return data.data;
    } catch (error) {
        console.log(error);
    }   
}

export function* handleGetMovies(){
    const movies = yield call(getMovies)
    yield put(setMovies(movies))
}


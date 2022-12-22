import axios from "axios"
import {call,put} from "redux-saga/effects"
import { setMovies } from "../../actions/movieActions";


async function getMovies(){
    try {
         const {data} = await axios.get("http://localhost:3001/movies");
         console.log();
         return data;
    } catch (error) {
        console.log(error);
    }   
}

export function* handleGetMovies(){
    const movies = yield call(getMovies)
    yield put(setMovies(movies))
}


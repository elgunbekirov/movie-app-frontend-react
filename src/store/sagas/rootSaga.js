import { takeLatest } from "redux-saga/effects";
import { GET_MOVIES } from "../actions/movieActions";
import { handleGetMovies } from "./movie/movieSaga";

function* rootSaga() {
    yield takeLatest(GET_MOVIES,handleGetMovies)
}

export default rootSaga;
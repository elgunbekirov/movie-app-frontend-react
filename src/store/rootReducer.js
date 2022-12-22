import { combineReducers } from "redux";
import movieReducer from "./reducers/movieReducer";

const rootReducer = combineReducers({
    movies:movieReducer
})

export default rootReducer;
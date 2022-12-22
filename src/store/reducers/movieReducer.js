import { SET_MOVIES } from "../actions/movieActions";

const initialState = [];

const productReducer = (state=initialState, {type,payload})=>{
    switch (type) {
        case SET_MOVIES:
            return payload;
        default:
            return state;
    }
}

export default productReducer;
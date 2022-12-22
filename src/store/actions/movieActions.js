export const SET_MOVIES = "SET_MOVIES"
export const GET_MOVIES = "GET_MOVIES"

export const setMovies = (movies)=>({
    type:SET_MOVIES,
    payload:movies
})

export const getMovies = ()=>({
    type:GET_MOVIES
})
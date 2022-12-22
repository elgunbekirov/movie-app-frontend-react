export const SET_MOVIES = "SET_MOVIES"
export const GET_MOVIES = "GET_MOVIES"

export const setMovies = (data)=>({
    type:SET_MOVIES,
    payload:data
})

export const getMovies = ()=>({
    type:GET_MOVIES
})
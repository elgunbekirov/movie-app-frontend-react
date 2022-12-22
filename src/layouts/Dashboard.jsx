import React from "react";
import MovieList from "../pages/MovieList";
import {Route,Routes} from "react-router-dom"
import MovieDetail from "../pages/MovieDetail";
import NotFound from "../pages/NotFound";

export default function Dashboard() {
  return (
    <div class="grid">
      <div class="col-9">
        <Routes>
          <Route exact path="/" element={<MovieList/>}/>
          <Route path="/movies" element={<MovieList/>}/>
          <Route path="/movies/detail/:id" element={<MovieDetail/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </div>
  );
}

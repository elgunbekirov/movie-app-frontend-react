import React, { useState, useEffect } from "react";
import MovieService from "../services/MovieService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";

export default function MovieList() {
  const navigator = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let movieService = new MovieService();
    movieService.getMovies().then((result) => {
      setMovies(result.data.data);
    });
  }, []);

  const handleGotoDetail = (event) => navigator(`/movies/detail/${event.data.id}`)

  return (
    <div>
      <div className="card">
        <DataTable value={movies} responsiveLayout="scroll" onRowClick={handleGotoDetail}>
          <Column field="title" header="Title"></Column>
          <Column field="releaseYear" header="Relese Year"></Column>
          <Column field="rating" header="Rating"></Column>
          <Column field="synopsis" header="Sinopsys"></Column>
        </DataTable>
      </div>
    </div>
  );
}

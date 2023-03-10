import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import MovieService from "../services/MovieService";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { Toast } from 'primereact/toast';

export default function MovieDetail() {
  let { title } = useParams();
  const dispatch = useDispatch();
  const toast = useRef(null)
  const [movie, setMovie] = useState({});

  useEffect(() => {
    let movieService = new MovieService();
    movieService.getMovieByTitle(title).then((result) => setMovie(result.data.data));
  }, []);

  const header = (
    <img
      alt="Movie"
      src="images/movie.png"
      onError={(e) =>
        (e.target.src =
          "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
      }
    />
  );
  const footer = (
    <span>
      <Button
        label="Close"
        icon="pi pi-times"
        className="p-button-secondary ml-2" />
    </span>
  );

  return (
    <div>
      <Toast ref={toast}/>
      <Card
        title={movie.title}
        subTitle={movie.releaseYear}
        style={{ width: "25em" }}
        footer={footer}
        header={header}
      >
        <p className="m-0" style={{ lineHeight: "1.5" }}>
           {movie.synopsis}
        </p>
      </Card>
    </div>
  );
}

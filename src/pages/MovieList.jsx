import React, { useState, useEffect, useRef } from 'react';
import MovieService from "../services/MovieService";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export default function MovieList() {

    let emptyMovie = {
        title: '',
        releaseYear: '',
        rating: 0,
        synopsis: ''
    };

    const [movies, setMovies] = useState(null);
    const [movieDialog, setMovieDialog] = useState(false);
    const [deleteMovieDialog, setDeleteMovieDialog] = useState(false);
    const [deleteMoviesDialog, setDeleteMoviesDialog] = useState(false);
    const [movie, setMovie] = useState(emptyMovie);
    const [selectedMovies, setSelectedMovies] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const movieService = new MovieService();
    useEffect(() => {
      movieService.getMovies().then((result) => {
        setMovies(result.data.data);
      });
    }, []); 


    const openNew = () => {
        setMovie(emptyMovie);
        setSubmitted(false);
        setMovieDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMovieDialog(false);
    }

    const hideDeleteMovieDialog = () => {
        setDeleteMovieDialog(false);
    }

    const hideDeleteMoviesDialog = () => {
        setDeleteMoviesDialog(false);
    }

    const saveMovie = () => {
        setSubmitted(true);

        if (movie.name.trim()) {
            let _movies = [...movies];
            let _movie = {...movie};
            if (movie.id) {
                const index = findIndexById(movie.id);

                _movies[index] = _movie;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Movie Updated', life: 3000 });
            }
            else {
                _movie.id = createId();
                _movie.image = 'movie-placeholder.svg';
                _movies.push(_movie);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Movie Created', life: 3000 });
            }

            setMovies(_movies);
            setMovieDialog(false);
            setMovie(emptyMovie);
        }
    }

    const editMovie = (movie) => {
        setMovie({...movie});
        setMovieDialog(true);
    }

    const confirmDeleteMovie = (movie) => {
        setMovie(movie);
        setDeleteMovieDialog(true);
    }

    const deleteMovie = () => {
        let _movies = movies.filter(val => val.id !== movie.id);
        setMovies(_movies);
        setDeleteMovieDialog(false);
        setMovie(emptyMovie);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Movie Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const importCSV = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');

            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();

            const importedData = data.map(d => {
                d = d.split(',');
                const processedData = cols.reduce((obj, c, i) => {
                    c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
                    obj[c] = d[i].replace(/['"]+/g, '');
                    (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                    return obj;
                }, {});

                processedData['id'] = createId();
                return processedData;
            });

            const _movies = [...movies, ...importedData];

            setMovies(_movies);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteMoviesDialog(true);
    }

    const deleteSelectedMovies = () => {
        let _movies = movies.filter(val => !selectedMovies.includes(val));
        setMovies(_movies);
        setDeleteMoviesDialog(false);
        setSelectedMovies(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Movies Deleted', life: 3000 });
    }

    const onCategoryChange = (e) => {
        let _movie = {...movie};
        _movie['category'] = e.value;
        setMovie(_movie);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _movie = {...movie};
        _movie[`${name}`] = val;

        setMovie(_movie);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _movie = {...movie};
        _movie[`${name}`] = val;

        setMovie(_movie);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedMovies || !selectedMovies.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/movie/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="movie-image" />
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMovie(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMovie(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Movies</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const movieDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMovie} />
        </React.Fragment>
    );
    const deleteMovieDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMovieDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMovie} />
        </React.Fragment>
    );
    const deleteMoviesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMoviesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMovies} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={movies} selection={selectedMovies} onSelectionChange={(e) => setSelectedMovies(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} movies"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="title" header="Title" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="releaseYear" header="Release Year" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="synopsis" header="Synopsis" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={movieDialog} style={{ width: '450px' }} header="Movie Details" modal className="p-fluid" footer={movieDialogFooter} onHide={hideDialog}>
                {movie.image && <img src={`images/movie/${movie.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={movie.image} className="movie-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" value={movie.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !movie.title })} />
                    {submitted && !movie.title && <small className="p-error">Title is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="synopsis">Synopsis</label>
                    <InputTextarea id="synopsis" value={movie.synopsis} onChange={(e) => onInputChange(e, 'synopsis')} required rows={3} cols={20} />
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="rating">Rating</label>
                        <InputNumber id="rating" value={movie.rating} onValueChange={(e) => onInputNumberChange(e, 'rating')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="releaseYear">Release Year</label>
                        <InputNumber id="releaseYear" value={movie.releaseYear} onValueChange={(e) => onInputNumberChange(e, 'releaseYear')} integeronly />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteMovieDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMovieDialogFooter} onHide={hideDeleteMovieDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {movie && <span>Are you sure you want to delete <b>{movie.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteMoviesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMoviesDialogFooter} onHide={hideDeleteMoviesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {movie && <span>Are you sure you want to delete the selected movies?</span>}
                </div>
            </Dialog>
        </div>
    );
} 
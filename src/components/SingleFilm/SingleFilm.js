import { NavLink, useParams, useRouteMatch, Route } from "react-router-dom";
import { useHistory, useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import s from './SingleFilm.module.css';
import movieApiService from '../../services/api-service';
import Cast from '../../components/Cast/Cast';
import Reviews from '../../components/Reviews/Reviews';
import Spinner from '../Spinner/Spinner';
import { IoArrowBackSharp } from "react-icons/io5";


const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w342';
// let prevLocation = null;  //для сохранения пути, откуда мы пришли, чтоб можно было вернуться по кнопке GO BACK

export default function SingleFilm() {
    const history = useHistory();
    const location = useLocation();
    const { url } = useRouteMatch();
    const { movieId } = useParams();
    const [film, setFilm] = useState(null);
    const [status, setStatus] = useState('pending');
    const [prevLocationState, setPrevLocationState] = useState(null);  //для сохранения пути, откуда мы пришли, чтоб можно было вернуться по кнопке 

//сохранение в стейте (или в локальной переменной - вариант), откуда мы пришли, чтоб потом можно было вернутся  туда по кнопке GO BACK
    
    useEffect(() => {
        if (!location.state) return;
        setPrevLocationState(location.state.from);
        // prevLocation = location.state.from;
    },[])

    useEffect(() => {
        

        async function fetchData() {
        setStatus('pending');
        let newRequest;
            try {
                newRequest = await movieApiService.fetchSingleFilm(movieId);
                setFilm(newRequest);
                setStatus(() => {
                    return (
                        newRequest.data.length === 0 ?
                            'rejected' :
                            'resolved'
                    )
                });
            }
            catch (error) {
                console.log('Error: request failed');
                return setStatus('failed');
        };
        };

        fetchData();
        // const {backdrop_path, title, release_date, genres, overview, vote_average, vote_count} = film.data	
    }, [movieId]);

    const handleGoBack = () => {
        if (!prevLocationState) return;
        // const { pathname, search } = prevLocation;
        const { pathname, search } = prevLocationState;
        history.push({
            pathname: pathname,
            search: search,
        });
    };
    
    return (
        <>
            {(status === 'pending') && <Spinner />}

            {(status === 'rejected') && <h2 className="galleryTitle">По запросу ничего не найдено</h2>}

            {(status === 'failed') && <h2 className="galleryTitle">Error: request failed. Нет соединения с интернетом или сервером</h2>}
            
            {(status === 'resolved') && (
                <>
                    <button type="button" onClick={handleGoBack} className={s.GoBackBtn}>
                        <IoArrowBackSharp />
                        <span>GO BACK</span>    
                    </button>
                    {(film) && (
                        <div className={s.SingleFilm}>
                            <div className={s.imageFrame}>
                                <img src={`${BASE_IMG_URL}${film.data.poster_path}`} alt={film.data.title} className={s.imgFilm} />
                            </div>
                            <div className={s.filmData}>
                                <h1 className={s.filmTitle}>{film.data.title}</h1>
                                <h4 className={s.filmText}>Released:</h4>
                                <p className={s.filmTextValue}>{film.data.release_date}</p>
                                <h4 className={s.filmText}>Overview:</h4>
                                <p className={s.filmTextValue}>{film.data.overview}</p>
                                <h4 className={s.filmText}>Genres:</h4>
                                <p className={s.filmTextValue}>{film.data.genres.map(items => items.name).join(', ').toLowerCase()}</p>
                                <h4 className={s.filmText}>Vote average:</h4>
                                <p className={s.filmTextValue}>{film.data.vote_average}</p>
                                <h4 className={s.filmText}>Additional information:</h4>
                                <NavLink to={`${url}/cast/${movieId}`} className={s.FilmLink}>cast</NavLink>
                                <NavLink to={`${url}/reviews/${movieId}`} className={s.FilmLink}>reviews</NavLink>
                            </div>
                        </div>
                    )}
                    <Route path={`${url}/cast/:movieId`}>
                        <Cast />
                    </Route>
                    <Route path={`${url}/reviews/:movieId`}>
                        <Reviews/>
                    </Route>
                </>
            )}
        </> 
    )
};
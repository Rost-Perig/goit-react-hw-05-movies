import { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useLocation} from 'react-router-dom';
import s from './HomeGallery.module.css';
import movieApiService from '../../services/api-service';
import Spinner from '../Spinner/Spinner';
import infiniteScroll from '../../services/infinite-scroll-service';


const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w342';

export default function HomeGallery() {
    const location = useLocation();
    const { url } = useRouteMatch();
    const [trendingMovieArr, setTrendingMovieArr] = useState([]);
    const [page, setPage] = useState(1);
    const [totalMovie, setTotalMovie] = useState(0);
    const [status, setStatus] = useState('pending');
    

    // подгрузкa только первой страницы

    useEffect(() => {
        async function fetchData() {
            setStatus('pending');
            let newRequest;
            try {
                newRequest = await movieApiService.fetchTrendingMovies(1);
                setTrendingMovieArr([...newRequest.data.results]);
                setTotalMovie(newRequest.data.total_results);
                setStatus(() => {
                    return (
                        newRequest.data.results === 0 ?
                            'rejected' :
                            'resolved'
                    )
                });
            }
            catch (error) {
                console.log('Error: request failed');
                return setStatus('failed')
            };
        };

        fetchData();
    }, []);

        // подгрузкa последующих страниц, кроме первой

    useEffect(() => {
        if (page === 1) return;
        async function nextFetch() {
            let newRequest;
            try {
                newRequest = await movieApiService.fetchTrendingMovies(page);
                if (newRequest.data.results.length === 0) return;
                setTrendingMovieArr(prevState => [...prevState, ...newRequest.data.results]);
                setTotalMovie(newRequest.data.total_results);
            }
            catch (error) {
                console.log('Error: request failed');
                return setStatus('failed')
            };       
        };
        nextFetch();
    }, [page]);

    // endless Scroll

    useEffect(() => {
        infiniteScroll(trendingMovieArr, 600, 0.2, () => setPage(prevState => prevState + 1));
    }, [trendingMovieArr]);


    return (
        <>
            {(status === 'pending') && <Spinner />}

            {(status === 'rejected') && <h2 className="galleryTitle">По запросу ничего не найдено</h2>}

            {(status === 'failed') && <h2 className="galleryTitle">Error: request failed. Нет соединения с интернетом или сервером</h2>}
            
            {(status === 'resolved') && (
                <>
                    <h2 className="galleryTitle">{totalMovie} самых популярных фильмов дня:</h2>
            
                    <ul id="gallery" className={s.MovieGallery}>
                        {trendingMovieArr.map(item => {
                            const { id, poster_path, title } = item;
                            return (
                                <li key={id} >
                                    <Link
                                        to={{
                                            pathname: `${url}/${id}`,
                                            state: { from: location },
                                        }}  
                                        className={s.MovieGalleryItem}>
                                        <img src={`${BASE_IMG_URL}${poster_path}`} id={id} alt={title} className={s.MovieGalleryItemImage} />
                                        <h4 className={s.MovieTitle}>{title}</h4>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </> 
            )}

            {((page * 20 >= totalMovie) && (status === 'resolved')) && <h2 className="galleryTitle">Запрос успешно выполнен</h2>}
            
        </>
        
        
    )
};
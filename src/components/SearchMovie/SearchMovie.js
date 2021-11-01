import { useState, useRef, useEffect } from 'react';
import { Link, useRouteMatch } from "react-router-dom";
import { ImSearch } from 'react-icons/im';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './SearchMovie.module.css';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import movieApiService from '../../services/api-service';
import infiniteScroll from '../../services/infinite-scroll-service';
import Spinner from '../Spinner/Spinner';
import NoImage from '../../images/NoImage.PNG'

const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w300';

export default function SearchMovie() {
    const { url } = useRouteMatch();
    const [inputQuery, setInputQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState(null);
    const [searchMovieArr, setSearchMovieArr] = useState([]);
    const [totalMovie, setTotalMovie] = useState(0);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');

    const inputRef = useRef();

    useEffect(() => {
        async function fetchData() {
            if (!searchQuery) return;
            setStatus('pending');
            let newRequest;
            try {
                newRequest = await movieApiService.fetchMovie(searchQuery, 1);
                setSearchMovieArr([...newRequest.data.results]);
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
    }, [searchQuery]);

    const handleInputChange = e => setInputQuery(e.currentTarget.value);

    const handleSubmit = e => {
        e.preventDefault();
        if (inputQuery.trim() === '') {
            toast.warn('Введи что-то!', {
                autoClose: 2000,
                theme: "colored",
                icon: false,
                }
            );
            return;
        };
        setSearchQuery(inputQuery);
        inputRef.current.placeholder = inputQuery;
        setInputQuery('');
    };

           // подгрузку последующих страниц, кроме первой

    useEffect(() => {
        if (page === 1) return;
        async function nextFetch() {
            let newRequest;
            try {
                newRequest = await movieApiService.fetchMovie(searchQuery, page);
                if (newRequest.data.results.length === 0) return;
                setSearchMovieArr(prevState => [...prevState, ...newRequest.data.results]);
                setTotalMovie(newRequest.data.total_results);
            }
            catch (error) {
                console.log('Error: request failed');
                return setStatus('failed')
            };       
        };
        nextFetch();
    }, [searchQuery, page]);

    // endless Scroll

    useEffect(() => {
        infiniteScroll(searchMovieArr, 600, 0.2, () => setPage(prevState => prevState + 1));
    }, [searchMovieArr]);

    return (
    <>
        <div className={s.Searchbar} >
            <span className={s.SearchTitle}>Искать:</span>
            <form className={s.SearchForm} onSubmit={handleSubmit}>
                <button type="submit" className={s.SearchFormButton}>
                    <ImSearch />
                </button>
                <label >
                    <input
                        className={s.SearchFormInput}
                        type="text"
                        name="searchInput"
                        ref={inputRef}
                        placeholder="search"
                        value={inputQuery}
                        onChange={handleInputChange}
                        pattern="^[0-9a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
                        title="Поисковое слово может состоять только из букв, апострофа, тире, цифр и пробелов."
                    // required
                    />
                </label>
            </form>
        </div>
        
        {(status === 'pending') && <Spinner />}

        {(status === 'rejected') && <h2 className="galleryTitle">По запросу ничего не найдено</h2>}
        
        {(status === 'failed') && <h2 className="galleryTitle">Error: request failed. Нет соединения с интернетом или сервером</h2>}
        
        {(status === 'resolved') && (
            <>
                <ul id="search-gallery" className={s.SearchList}>
                    {searchMovieArr.map(item => {
                        const { id, backdrop_path, title, release_date } = item;
                        return (
                            <li key={id}  id={id}>
                                <Link to={`${url}/${id}`} className={s.SearchListItem} >
                                {backdrop_path && <img src={`${BASE_IMG_URL}${backdrop_path}`} alt={title} className={s.SearchListItemImage} />}
                                {!backdrop_path && <img src={NoImage} alt="NoImage" />}
                                <span className={s.SearchedMovieTitle}>{title}</span>
                                <span className={s.SearchedMovieTitle}>relised: {release_date}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </> 
            )}
            
        {((page * 20 >= totalMovie) && (status === 'resolved')) && <h2 className="galleryTitle">Запрос успешно выполнен</h2>}

        <ToastContainer/>
    </>
        
    )
};
 
SearchMovie.propTypes = {
    searchQuery: PropTypes.string,
};

import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import movieApiService from '../../services/api-service';
import s from './Reviews.module.css';
// import NoImage154 from '../../images/NoImage154.PNG';
import Spinner from '../Spinner/Spinner';

// const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w154';

export default function Reviews() {
    const { movieId } = useParams();
    const [reviews, setReviews] = useState(null);
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        async function fetchData() {
            setStatus('pending');
            let newRequest;
            try {
                newRequest = await movieApiService.fetchReviews(movieId);
                setReviews(newRequest.data.results);
                setStatus(() => {
                    return (
                        newRequest.data.results.length === 0 ?
                            'rejected' :
                            'resolved'
                    )
                });
            }
            catch (error) {
                console.log('Error: request failed1');
                return setStatus('failed');
            };
        };
        fetchData();
    }, [movieId]);

    


    return (
        <>
            {(status === 'pending') && <Spinner />}

            {(status === 'rejected') && <h2 className="galleryTitle">По запросу ничего не найдено</h2>}

            {(status === 'failed') && <h2 className="galleryTitle">Error: request failed. Нет соединения с интернетом или сервером</h2>}
            
            {(status === 'resolved') && (
                <>
                    {reviews && (
                        <ul className={s.ReviewsList}>
                            {reviews.map(item => {
                                const {author, id, content, created_at } = item;
                                return (
                                    <li key={id} className={s.ReviewsListItem}>
                                        <span className={s.ReviewsAuthorTitle}>Author: </span>
                                        <span className={s.ReviewsAuthor}>{author}</span>
                                        <p className={s.ReviewsCreated}>Created: { created_at.slice(0, 10)}</p>
                                        <p className={s.ReviewsContent}>{content}</p>
                                    </li>
                            )})}
                        </ul>
                    )}
                </>
            )}
            
        </>   
    )
};
import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import movieApiService from '../../services/api-service';
import s from './Cast.module.css';
import NoImage154 from '../../images/NoImage154.PNG';
import Spinner from '../Spinner/Spinner';

const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w154';

export default function Cast() {
    const { movieId } = useParams();
    const [cast, setCast] = useState(null);
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        async function fetchData() {
            setStatus('pending');
            let newRequest;
            try {
                newRequest = await movieApiService.fetchCast(movieId);
                setCast(newRequest.data.cast);
                setStatus(() => {
                    return (
                        newRequest.data.cast.length === 0 ?
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
                    {cast && (
                        <ul className={s.castGallery}>
                            {cast.map(item => {
                                const {profile_path, id, name } = item;
                                return (
                                    <li key={id} className={s.castGalleryItem}>
                                        {profile_path && <img src={`${BASE_IMG_URL}${profile_path}`} alt={name} className={s.CastGalleryItemImage}/>}
                                        {!profile_path && <img src={NoImage154} alt="NoImage" />}
                                        <h5 className={s.CastTitle}>{name}</h5>
                                    </li>
                            )})}
                        </ul>
                    )}
                </>
            )}
            
        </>   
    )
};
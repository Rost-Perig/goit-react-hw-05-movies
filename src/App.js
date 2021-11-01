import { lazy, Suspense } from 'react';
import React from 'react';
import {Switch, Route, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import AppBar from './components/AppBar/AppBar';
import BtnToTop from './components/BtnToTop/BtnToTop';
import Spinner from './components/Spinner/Spinner';
// import HomeView from './views/HomeView';
// import MoviesView from './views/MoviesView';
// import FilmView from './views/FilmView';


const HomeView = lazy(() => import('./views/HomeView.js'));
const MoviesView = lazy(() => import('./views/MoviesView.js'));
const FilmView = lazy(() => import('./views/FilmView.js'));



function App() {
    const history = useHistory();
    // const location = useLocation();

    useEffect(() => {
        // console.log('history: ', history.location.pathname)
        // console.log('location: ', location)
        if(history.location.pathname.includes("/home") || history.location.pathname.includes("/movies")) return;
        history.push('/home');
    },[history])

    return (
        <div className="App">

            <AppBar />
            
            <Suspense fallback={<Spinner />}>
                <Switch>
                <Route path='/home' exact>
                        <HomeView/>
                    </Route>

                    <Route path='/home/:movieId'>
                        <FilmView/>
                    </Route>

                    <Route path='/movies' exact>
                        <MoviesView/>
                    </Route>

                    <Route path='/movies/:movieId'>
                        <FilmView/>
                    </Route>  
                </Switch>   
            </Suspense>

            <BtnToTop/>
            
        </div>
    );
};


export default App;
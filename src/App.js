import { lazy, Suspense } from 'react';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
    // вариант загружаться первый раз с /home не используя Redirect, не лучшее решение, но..... вариант
    // const history = useHistory();
    // useEffect(() => {
    //     if(history.location.pathname.includes("/home") || history.location.pathname.includes("/movies")) return;
    //     history.push('/home');
    // },[history])

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
                    
                    <Redirect to='/home'>
                        <HomeView/>
                    </Redirect>
                </Switch>   
            </Suspense>

            <BtnToTop/>
            
        </div>
    );
};


export default App;
import Navigation from '../Navigation/Navigation';
import HistoryBar from '../HistoryBar/HistoryBar';
import s from './Appbar.module.css';

export default function AppBar() {
  return (
    <header className={s.header}>
      <Navigation />
      <HistoryBar/>
    </header>
  );
}
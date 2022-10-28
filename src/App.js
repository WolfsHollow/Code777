import { Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Game from './components/Game'
import Lobby from './components/Lobby'

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Homepage />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </Route>
    </Routes>
  );
}

export default App;

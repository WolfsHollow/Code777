import { Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage'
import Game from './pages/Game'
import QuestionPage from './pages/QuestionPage';
import Lobby from './pages/Lobby';
import CreateRoom from './pages/CreateRoom';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Homepage />} />
        {/* <Route path="/lobby" element={<Lobby />} /> */}
        <Route path="/room/game" element={<Game />} />
        <Route path="/room/" element={<Lobby />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/question" element={<QuestionPage />} />

      </Route>
    </Routes>
  );
}

export default App;

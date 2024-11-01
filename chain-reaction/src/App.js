import './App.css';
import HomePage from "./components/pages/HomePage";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import SocketPage from './components/pages/SocketPage';
import Game from './components/pages/Game';
import OfflineGame from './components/pages/OfflineGame';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path="/socket" element={<SocketPage />}></Route>
          <Route path="/game" element={<Game />}></Route>
          <Route path="/offline" element={<OfflineGame />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

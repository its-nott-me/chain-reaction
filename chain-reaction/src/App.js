import './App.css';
import HomePage from "./components/pages/HomePage";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import SocketPage from './components/pages/SocketPage';
import GamePage from './components/pages/Game';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path="/socket" element={<SocketPage />}></Route>
          <Route path="/game" element={<GamePage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

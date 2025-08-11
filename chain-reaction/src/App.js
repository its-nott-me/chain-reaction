import './App.css';
import HomePage from "./components/pages/HomePage";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Game from './components/pages/Game';
import OfflineGame from './components/pages/OfflineGame';
import Register from './components/authComponents/Register';
import Login from './components/authComponents/Login';
import CreateOrJoinRoom from './components/pages/CreateOrJoinRoom';
import WaitingRoom from './components/onlineGame/WaitingRoom';
import { SocketProvider } from './contexts/SocketContext'; // Import the SocketProvider
import OnlineGame from './components/pages/OnlineGame';
import UnauthorizedPage from './components/errorPages/Unauthorised_401';
import LoggedOutPage from './components/authComponents/LoggedOutPage';
import NotFoundPage from './components/errorPages/NotFound_404';
import HowToPlayPage from './components/pages/HowToPlay';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path="/game" element={<Game />}></Route>
            <Route path="/offline" element={<OfflineGame />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/online" element={<SocketProvider><CreateOrJoinRoom /></SocketProvider> }></Route>
            <Route path="/online/waiting/:roomCode" element={<SocketProvider><WaitingRoom /></SocketProvider>} />
            <Route path="/online/game/:roomId" element={<SocketProvider><OnlineGame /></SocketProvider>} />

            <Route path="/unauthorised" element={<UnauthorizedPage />} />
            <Route path="/logoutSuccess" element={<LoggedOutPage />} />
            <Route path="/how-to" element={<HowToPlayPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;

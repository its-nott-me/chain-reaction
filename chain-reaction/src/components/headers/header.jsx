import react from "react";
import {Link} from "react-router-dom";

function header({user, handleLogin, handleLogout}){
    return(
        <header className="flex justify-between item-center p-6 bg-gray-800 text-white">

            <div className="text-2x1 font-bold">
                {/* logo or game title */}
                <Link to="/" className="text-blue-400 hover:text-blue-300">
                    <h1>Chain Reaction</h1>
                </Link>
            </div>

            <nav className="flex space-x-6">
                {/* navigation links */}
                <Link to="/play" className="text-lg hover:text-grey-300">
                    Play
                </Link>
                <Link to="/leaderboard" className="text-lg hover:text-gray-300">
                    Leaderboard
                </Link>
                <Link to="/about" className="text-lg hover:text-gray-300">
                    About
                </Link>
            </nav>

            <div className="flex items-center">
                {/* user authentication section */}
                {user ?(
                    <div className="flex items-center space-x-4">
                        <span className="text-lg">Hello, {user.name}</span>
                        <button 
                            onClick={handleLogout} 
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                        >
                        </button>
                    </div>
                    ) : (
                        <button 
                            onClick={handleLogin} 
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                        >
                            Login
                        </button>
                    )
                }
            </div>
        </header>
    )
}

export default header;
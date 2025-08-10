import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedGridPattern from "../errorPages/AnimatedGridPattern";

const LoggedOutPage = () => {
    const [countdown, setCountdown] = useState(5); // Countdown starts at 5 seconds
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1); // Decrease countdown by 1 every second
        }, 1000);

        // Redirect when countdown reaches 0
        if (countdown === 0) {
            navigate("/");
        }

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [countdown, navigate]);

    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900">
        {/* Background Grid Pattern Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatedGridPattern
            width={30} // Width of each grid square
            height={30} // Height of each grid square
            numSquares={100} // Number of grid squares
            maxOpacity={0.3} // Maximum opacity for the animation
            duration={3} // Animation duration
            repeatDelay={0.8} // Delay between animation repeats
            className="pointer-events-none" // Additional styling
          />
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold text-gray-300 z-10">You have been logged out</h1>
        <p className="mt-4 text-gray-300 text-center max-w-md z-10">
          Thank you for visiting. You will be redirected to the home page in 
          <span className="font-semibold text-lavender-magenta"> {countdown} seconds</span>.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-8 py-3 bg-lavender-magenta text-white text-lg font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-[#c379e0] focus:outline-none focus:ring-4 focus:ring-blue-300 relative overflow-hidden group"
        >
          Go to Home Now
        </button>
      </div>
    );
};

export default LoggedOutPage;

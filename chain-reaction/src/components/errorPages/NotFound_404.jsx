import { useNavigate } from "react-router-dom";
import AnimatedGridPattern from "./AnimatedGridPattern";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        {/* Background Grid Pattern */}
            <div className="absolute inset-0">
                <AnimatedGridPattern
                width={30}
                height={30}
                numSquares={150}
                maxOpacity={0.2}
                duration={4}
                repeatDelay={1}
                className="pointer-events-none"
                />
            </div>

            {/* Content Section */}
            <div className="relative z-10 text-center">
                <h1 className="text-9xl font-extrabold text-gray-300 drop-shadow-md">404</h1>
                <h2 className="mt-4 text-3xl font-semibold text-gray-300 drop-shadow-sm">
                    Not Found
                </h2>
                <p className="mt-2 text-gray-300 max-w-lg mx-auto leading-relaxed">
                    Sorry <span class="text-lime-300 font-semibold">zoro..</span> you are lost again
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 px-8 py-3 bg-lavender-magenta text-white text-lg font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-[#c379e0] focus:outline-none focus:ring-4 focus:ring-blue-300 relative overflow-hidden group"
                    >
                    <span className="absolute inset-0 w-0 bg-purple-700/20 group-hover:w-full transition-all duration-200 ease-in-out"></span>
                    <span className="relative z-10" style={{ whiteSpace: 'pre' }}>
                        Go Home {"\t"} ㄟ( ▔, ▔ )ㄏ
                    </span>
                </button>

            </div>
        </div>

    );
};

export default NotFoundPage;

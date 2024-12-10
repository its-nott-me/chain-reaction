import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function AnimatedGridPattern({
  width = 40,
  height = 40,
  numSquares = 50,
  className = "",
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(generateSquares(numSquares));

  // Helper to generate random positions for squares
  function getRandomPosition() {
    const x = Math.random() * containerSize.width;
    const y = Math.random() * containerSize.height;
    return { x, y };
  }

  // Generate an array of squares with random positions
  function generateSquares(count) {
    return Array.from({ length: count }, () => getRandomPosition());
  }

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setContainerSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize(); // Initial call

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Regenerate squares whenever container size changes
  useEffect(() => {
    setSquares(generateSquares(numSquares));
  }, [containerSize, numSquares]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {squares.map(({ x, y }, index) => (
        <motion.div
          key={index}
          className="absolute bg-gray-300 rounded-full"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${x}px`,
            top: `${y}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: maxOpacity }}
          transition={{
            duration,
            repeat: Infinity,
            repeatDelay,
            repeatType: "reverse",
            delay: index * 0.1,
          }}
          onAnimationComplete={() => {
            // Regenerate position after animation completes
            setSquares((prevSquares) =>
              prevSquares.map((square, i) =>
                i === index ? getRandomPosition() : square
              )
            );
          }}
        />
      ))}
    </div>
  );
}

export default AnimatedGridPattern;

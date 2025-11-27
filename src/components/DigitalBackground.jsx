import React, { useEffect, useRef } from 'react';

const DigitalBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const fontSize = 14;
        const columns = Math.ceil(window.innerWidth / fontSize);
        const drops = new Array(columns).fill(1);

        // Wave configuration
        let time = 0;

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#FF1744'; // Neon Red
            ctx.font = `${fontSize}px monospace`;

            time += 0.01;

            for (let i = 0; i < drops.length; i++) {
                // Generate random character (0 or 1, or hex)
                const text = Math.random() > 0.5 ? '1' : '0';

                // Calculate wave offset
                // We shift the x position based on a sine wave of the y position and time
                const xOffset = Math.sin(drops[i] * 0.05 + time) * 20;

                const x = i * fontSize + xOffset;
                const y = drops[i] * fontSize;

                // Draw the character
                // Vary opacity for depth
                const opacity = Math.random() * 0.5 + 0.1;
                ctx.fillStyle = `rgba(255, 23, 68, ${opacity})`;
                ctx.fillText(text, x, y);

                // Reset drop to top randomly or when off screen
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
            style={{ background: 'black' }}
        />
    );
};

export default DigitalBackground;

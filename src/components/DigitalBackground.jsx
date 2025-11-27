import React, { useEffect, useRef } from 'react';

const DigitalBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('Canvas ref is null');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2d context');
            return;
        }

        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Fill with black initially
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const fontSize = 20;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        // Initialize drops at random positions
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -50);
        }

        let time = 0;

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `bold ${fontSize}px monospace`;

            time += 0.03;

            for (let i = 0; i < drops.length; i++) {
                // Generate random character (0 or 1)
                const text = Math.random() > 0.5 ? '1' : '0';

                // Calculate wave offset
                const xOffset = Math.sin(drops[i] * 0.08 + time) * 20;

                const x = i * fontSize + xOffset;
                const y = drops[i] * fontSize;

                // Make characters brighter and more visible
                const opacity = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
                ctx.fillStyle = `rgba(255, 23, 68, ${opacity})`;
                ctx.fillText(text, x, y);

                // Reset drop to top when it goes off screen
                if (y > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }

                drops[i] += 0.5; // Slower falling speed
            }

            // Draw the "ZERO DIVISION" text as a mask (on top of the falling characters)
            // This creates a cutout effect where the text blocks the characters
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 200px Arial, sans-serif';
            ctx.lineWidth = 15;

            // Draw "ZERO" with stroke for better visibility
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'black';
            ctx.strokeText('ZERO', canvas.width / 2, canvas.height / 2 - 120);
            ctx.fillText('ZERO', canvas.width / 2, canvas.height / 2 - 120);

            // Draw "DIVISION"
            ctx.strokeText('DIVISION', canvas.width / 2, canvas.height / 2 + 80);
            ctx.fillText('DIVISION', canvas.width / 2, canvas.height / 2 + 80);

            animationFrameId = requestAnimationFrame(draw);
        };

        console.log('Starting animation with', columns, 'columns');
        draw();

        return () => {
            console.log('Cleaning up animation');
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default DigitalBackground;

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
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        canvas.addEventListener('mousemove', handleMouseMove);

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

                // Calculate distance from mouse
                const distanceFromMouse = Math.sqrt(
                    Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
                );

                // Characters react to mouse - push away or brighten
                let cursorEffect = 0;
                if (distanceFromMouse < 100) {
                    cursorEffect = (100 - distanceFromMouse) / 100;
                }

                // Make characters brighter and more visible
                const baseOpacity = Math.random() * 0.4 + 0.6;
                const opacity = Math.min(1, baseOpacity + cursorEffect * 0.4);
                ctx.fillStyle = `rgba(255, 23, 68, ${opacity})`;

                // Add slight push effect from cursor
                const pushX = cursorEffect * 10 * (x - mouseX) / distanceFromMouse || 0;
                const pushY = cursorEffect * 10 * (y - mouseY) / distanceFromMouse || 0;

                ctx.fillText(text, x + pushX, y + pushY);

                // Reset drop to top when it goes off screen
                if (y > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }

                drops[i] += 0.5; // Slower falling speed
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        console.log('Starting animation with', columns, 'columns');
        draw();

        return () => {
            console.log('Cleaning up animation');
            canvas.removeEventListener('mousemove', handleMouseMove);
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
                pointerEvents: 'auto'
            }}
        />
    );
};

export default DigitalBackground;

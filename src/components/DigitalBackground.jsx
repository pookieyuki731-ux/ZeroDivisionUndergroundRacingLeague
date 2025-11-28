import React, { useEffect, useRef } from 'react';

const DigitalBackground = ({ color = '#ff1744' }) => {
    const canvasRef = useRef(null);
    const colorRef = useRef(color); // Store color in ref to avoid restarting animation

    // Update color ref when color prop changes
    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const fontSize = 16;
        const charSet = ['.', '+', '◇', '◈']; // Characters from low to high intensity

        let time = 0;

        const draw = () => {
            // Clear with slight fade for trail effect (optional, but clean clear is better for this style)
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const cols = Math.ceil(canvas.width / fontSize);
            const rows = Math.ceil(canvas.height / fontSize);

            time += 0.015; // Speed of the wave

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * fontSize + fontSize / 2;
                    const y = j * fontSize + fontSize / 2;

                    // Calculate distance from mouse for interaction
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Wave calculation
                    // Combine multiple sine waves for a more organic "merging" feel
                    const wave1 = Math.sin(i * 0.1 + time);
                    const wave2 = Math.cos(j * 0.1 + time * 0.8);
                    const wave3 = Math.sin((i + j) * 0.05 + time * 0.5);

                    // Base intensity (-1 to 1) -> normalized (0 to 1)
                    let intensity = (wave1 + wave2 + wave3) / 3;

                    // Mouse interaction: create a ripple/distortion effect
                    if (dist < 300) {
                        const interaction = (1 - dist / 300);
                        intensity += interaction * 0.5;
                    }

                    // Clamp intensity between 0 and 1
                    intensity = Math.max(0, Math.min(1, (intensity + 1) / 2));

                    // Determine character based on intensity
                    const charIndex = Math.floor(intensity * (charSet.length - 0.01));
                    const char = charSet[charIndex];

                    // Color calculation
                    // Opacity based on intensity
                    const opacity = 0.1 + (intensity * 0.9);

                    ctx.globalAlpha = opacity;
                    ctx.fillStyle = colorRef.current; // Use ref instead of prop

                    ctx.fillText(char, x, y);
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array - animation runs once and never restarts

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
                pointerEvents: 'none' // Allow clicks to pass through to form
            }}
        />
    );
};

export default DigitalBackground;

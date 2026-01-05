import { useState, useEffect, useRef } from 'react';

/**
 * Performance Monitor Component
 * Only renders in development mode (controlled by parent via import.meta.env.DEV)
 * Displays FPS, Memory usage, and DOM node count
 */
const PerformanceMonitor = () => {
    const [stats, setStats] = useState({ fps: 0, memory: 0, domNodes: 0 });
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const frameCountRef = useRef(0);

    useEffect(() => {
        const animate = (time) => {
            if (previousTimeRef.current !== undefined) {
                const deltaTime = time - previousTimeRef.current;
                frameCountRef.current++;

                if (deltaTime >= 1000) {
                    const memory = performance.memory
                        ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
                        : 0;
                    const domNodes = document.getElementsByTagName('*').length;

                    setStats({
                        fps: frameCountRef.current,
                        memory,
                        domNodes
                    });

                    frameCountRef.current = 0;
                    previousTimeRef.current = time;
                }
            } else {
                previousTimeRef.current = time;
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#00ff00',
            padding: '10px 14px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 9999,
            display: 'flex',
            gap: '12px',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
            <span>🎯 FPS: <strong>{stats.fps}</strong></span>
            {stats.memory > 0 && <span>💾 RAM: <strong>{stats.memory} MB</strong></span>}
            <span>🌳 DOM: <strong>{stats.domNodes}</strong></span>
        </div>
    );
};

export default PerformanceMonitor;

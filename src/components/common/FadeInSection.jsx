
import React, { useState, useEffect, useRef } from 'react';
import styles from './FadeInSection.module.css';

const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FadeInSection = ({ children, className = '', delay = '0s', ...props }) => {
    const [isVisible, setIsVisible] = useState(prefersReducedMotion);
    const domRef = useRef();

    useEffect(() => {
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            });
        });
        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            className={`${styles.section} ${isVisible ? styles.visible : ''} ${className}`}
            ref={domRef}
            style={{ '--delay': delay }}
            {...props}
        >
            {children}
        </div>
    );
};

export default FadeInSection;

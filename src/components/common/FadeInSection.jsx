
import React, { useState, useEffect, useRef } from 'react';

const FadeInSection = ({ children, className = '', delay = '0s', ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
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
            className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}
            ref={domRef}
            style={{ '--delay': delay }}
            {...props}
        >
            {children}
        </div>
    );
};

export default FadeInSection;

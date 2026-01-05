import { useState, useRef, useEffect } from 'react';

/**
 * MultiSelect Component
 * A chip-based multiple selection component for filtering participants
 */
const MultiSelect = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const selectAll = () => {
        onChange([...options]);
    };

    const clearAll = () => {
        onChange([]);
    };

    const getDisplayText = () => {
        if (selected.length === 0) return 'Todos';
        if (selected.length === 1) return selected[0];
        if (selected.length === options.length) return 'Todos';
        return `${selected.length} seleccionados`;
    };

    return (
        <div className="multi-select-container" ref={containerRef}>
            <button
                type="button"
                className="multi-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{getDisplayText()}</span>
                <span className="multi-select-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="multi-select-dropdown">
                    <div className="multi-select-actions">
                        <button type="button" onClick={selectAll} className="multi-select-action-btn">
                            Seleccionar todos
                        </button>
                        <button type="button" onClick={clearAll} className="multi-select-action-btn">
                            Limpiar
                        </button>
                    </div>
                    <div className="multi-select-options">
                        {options.map(option => (
                            <label key={option} className="multi-select-option">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                />
                                <span className="multi-select-option-text">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;

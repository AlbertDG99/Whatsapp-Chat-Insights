import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './MultiSelect.module.css';

const MultiSelect = ({ id, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const optionRefs = useRef([]);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setFocusedIndex(-1);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeDropdown]);

    // Scroll focused option into view
    useEffect(() => {
        if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
            optionRefs.current[focusedIndex].scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);

    const toggleOption = useCallback((option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    }, [selected, onChange]);

    const selectAll = () => {
        onChange([...options]);
    };

    const clearAll = () => {
        onChange([]);
    };

    const getDisplayText = () => {
        if (selected.length === 0) return 'Todos los participantes';
        if (selected.length === 1) return selected[0];
        if (selected.length === options.length) return `Todos (${options.length})`;
        return `${selected.length} seleccionados`;
    };

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                closeDropdown();
                buttonRef.current?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < options.length) {
                    toggleOption(options[focusedIndex]);
                }
                break;
            case 'Tab':
                closeDropdown();
                break;
        }
    }, [isOpen, focusedIndex, options, toggleOption, closeDropdown]);

    return (
        <div className={styles.container} ref={containerRef} onKeyDown={handleKeyDown}>
            <button
                id={id}
                type="button"
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                ref={buttonRef}
            >
                <span>{getDisplayText()}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.actions}>
                        <button type="button" onClick={selectAll} className={styles.actionBtn}>
                            Seleccionar todos
                        </button>
                        <button type="button" onClick={clearAll} className={styles.actionBtn}>
                            Limpiar
                        </button>
                    </div>
                    <div className={styles.options} role="listbox" aria-multiselectable="true">
                        {options.map((option, index) => (
                            <label
                                key={option}
                                className={`${styles.option} ${index === focusedIndex ? styles.focused : ''}`}
                                role="option"
                                aria-selected={selected.includes(option)}
                                ref={el => optionRefs.current[index] = el}
                                tabIndex={index === focusedIndex ? 0 : -1}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                    tabIndex={-1}
                                />
                                <span className={styles.optionText}>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;

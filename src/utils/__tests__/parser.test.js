import { describe, it, expect } from 'vitest';
import { parseChat } from '../parser';

describe('parseChat', () => {
  it('returns empty array for empty input', () => {
    expect(parseChat('')).toEqual([]);
  });

  it('returns empty array for garbage input', () => {
    expect(parseChat('just some random text\nwith no chat format')).toEqual([]);
  });

  it('parses Android format messages', () => {
    const text = `14/12/20, 15:30 - Juan: Hola
14/12/20, 15:31 - María: Qué tal?`;
    const result = parseChat(text);
    expect(result).toHaveLength(2);
    expect(result[0].author).toBe('Juan');
    expect(result[0].content).toBe('Hola');
    expect(result[1].author).toBe('María');
    expect(result[1].content).toBe('Qué tal?');
  });

  it('parses iOS format messages', () => {
    const text = `[14/12/20, 15:30:12] Juan: Hola
[14/12/20, 15:31:05] María: Qué tal?`;
    const result = parseChat(text);
    expect(result).toHaveLength(2);
    expect(result[0].author).toBe('Juan');
    expect(result[0].content).toBe('Hola');
    expect(result[1].author).toBe('María');
  });

  it('handles multi-line messages', () => {
    const text = `14/12/20, 15:30 - Juan: Primera línea
segunda línea
tercera línea
14/12/20, 15:31 - María: Ok`;
    const result = parseChat(text);
    expect(result).toHaveLength(2);
    expect(result[0].content).toContain('segunda línea');
    expect(result[0].content).toContain('tercera línea');
  });

  it('detects multimedia messages', () => {
    const text = `14/12/20, 15:30 - Juan: <Multimedia omitido>
14/12/20, 15:31 - María: Hola`;
    const result = parseChat(text);
    expect(result[0].isMultimedia).toBe(true);
    expect(result[1].isMultimedia).toBe(false);
  });

  it('detects English multimedia format', () => {
    const text = `14/12/20, 15:30 - Juan: <Media omitted>`;
    const result = parseChat(text);
    expect(result[0].isMultimedia).toBe(true);
  });

  it('creates valid timestamp objects', () => {
    const text = `14/12/20, 15:30 - Juan: Test`;
    const result = parseChat(text);
    expect(result[0].timestamp).toBeInstanceOf(Date);
    expect(result[0].timestamp.getFullYear()).toBe(2020);
    expect(result[0].timestamp.getMonth()).toBe(11); // December = 11
    expect(result[0].timestamp.getDate()).toBe(14);
  });

  it('handles dot-separated dates', () => {
    const text = `14.12.20, 15:30 - Juan: Test`;
    const result = parseChat(text);
    expect(result).toHaveLength(1);
    expect(result[0].timestamp.getDate()).toBe(14);
  });

  it('handles 4-digit year', () => {
    const text = `14/12/2023, 15:30 - Juan: Test`;
    const result = parseChat(text);
    expect(result[0].timestamp.getFullYear()).toBe(2023);
  });

  it('strips BiDi markers', () => {
    const text = `\u200e14/12/20, 15:30 - Juan: Hola`;
    const result = parseChat(text);
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Juan');
  });
});

import { describe, it, expect } from 'vitest';
import { calculateStats } from '../statsCalculator';

const makeMsg = (author, content, date = new Date('2024-01-15T10:00:00'), isMultimedia = false) => ({
  author,
  content,
  timestamp: date,
  isMultimedia,
  date: date.toISOString().split('T')[0],
  time: date.toTimeString().slice(0, 8)
});

describe('calculateStats', () => {
  it('returns null for null input', () => {
    expect(calculateStats(null)).toBeNull();
  });

  it('returns null for empty array', () => {
    expect(calculateStats([])).toBeNull();
  });

  it('counts messages correctly', () => {
    const messages = [
      makeMsg('Juan', 'Hola'),
      makeMsg('María', 'Qué tal'),
      makeMsg('Juan', 'Bien')
    ];
    const stats = calculateStats(messages);
    expect(stats.totalMessages).toBe(3);
  });

  it('counts unique authors', () => {
    const messages = [
      makeMsg('Juan', 'Hola'),
      makeMsg('María', 'Qué tal'),
      makeMsg('Juan', 'Bien')
    ];
    const stats = calculateStats(messages);
    expect(stats.uniqueAuthors).toBe(2);
  });

  it('counts active days', () => {
    const messages = [
      makeMsg('Juan', 'Hola', new Date('2024-01-15T10:00:00')),
      makeMsg('Juan', 'Test', new Date('2024-01-15T14:00:00')),
      makeMsg('Juan', 'Otro', new Date('2024-01-16T10:00:00'))
    ];
    const stats = calculateStats(messages);
    expect(stats.daysActive).toBe(2);
  });

  it('excludes multimedia from text-based stats', () => {
    const messages = [
      makeMsg('Juan', '<Multimedia omitido>', new Date('2024-01-15T10:00:00'), true),
      makeMsg('Juan', 'Hola', new Date('2024-01-15T10:01:00'))
    ];
    const stats = calculateStats(messages);
    // Only the text message should be counted in totalMessages (valid message count)
    expect(stats.totalMessages).toBe(1);
  });

  it('excludes deleted messages from text-based stats', () => {
    const messages = [
      makeMsg('Juan', 'Eliminaste este mensaje'),
      makeMsg('Juan', 'Hola')
    ];
    const stats = calculateStats(messages);
    expect(stats.totalMessages).toBe(1);
  });

  it('tracks historic streak correctly', () => {
    const base = new Date('2024-01-15T10:00:00');
    const messages = [
      makeMsg('Juan', 'Msg 1', new Date(base.getTime())),
      makeMsg('Juan', 'Msg 2', new Date(base.getTime() + 60000)),
      makeMsg('Juan', 'Msg 3', new Date(base.getTime() + 120000)),
      makeMsg('María', 'Reply', new Date(base.getTime() + 180000)),
      makeMsg('Juan', 'Back', new Date(base.getTime() + 240000))
    ];
    const stats = calculateStats(messages);
    expect(stats.historicStreak.author).toBe('Juan');
    expect(stats.historicStreak.count).toBe(3);
  });

  it('detects conversation starters after gap', () => {
    const messages = [
      makeMsg('Juan', 'Hola', new Date('2024-01-15T10:00:00')),
      makeMsg('María', 'Hey', new Date('2024-01-15T17:00:00')) // 7h gap > 6h threshold
    ];
    const stats = calculateStats(messages);
    // María started a conversation after the threshold
    const starterData = stats.starterChartData.datasets[0].data;
    expect(starterData.some(v => v > 0)).toBe(true);
  });

  it('generates correct chart data structures', () => {
    const messages = [
      makeMsg('Juan', 'Hola'),
      makeMsg('María', 'Qué tal')
    ];
    const stats = calculateStats(messages);

    // Verify chart data structures exist
    expect(stats.authorChartData).toBeDefined();
    expect(stats.authorChartData.labels).toBeDefined();
    expect(stats.authorChartData.datasets).toBeDefined();
    expect(stats.timelineChartData).toBeDefined();
    expect(stats.hourlyChartData).toBeDefined();
    expect(stats.dayOfWeekChartData).toBeDefined();
    expect(stats.emojiChartData).toBeDefined();
    expect(stats.mediaChartData).toBeDefined();
    expect(stats.laughterChartData).toBeDefined();
    expect(stats.starterChartData).toBeDefined();
    expect(stats.avgLengthChartData).toBeDefined();
    expect(stats.weekendChartData).toBeDefined();
    expect(stats.linkChartData).toBeDefined();
    expect(stats.questionChartData).toBeDefined();
    expect(stats.wordChartData).toBeDefined();
    expect(stats.seasonalityChartData).toBeDefined();
  });

  it('counts hourly distribution correctly', () => {
    const messages = [
      makeMsg('Juan', 'Morning', new Date('2024-01-15T08:00:00')),
      makeMsg('Juan', 'Morning2', new Date('2024-01-15T08:30:00')),
      makeMsg('Juan', 'Evening', new Date('2024-01-15T20:00:00'))
    ];
    const stats = calculateStats(messages);
    expect(stats.hourlyChartData.datasets[0].data[8]).toBe(2);
    expect(stats.hourlyChartData.datasets[0].data[20]).toBe(1);
  });

  it('multimedia messages still count for active days', () => {
    const messages = [
      makeMsg('Juan', '<Multimedia omitido>', new Date('2024-01-15T10:00:00'), true),
      makeMsg('Juan', 'Hola', new Date('2024-01-16T10:00:00'))
    ];
    const stats = calculateStats(messages);
    expect(stats.daysActive).toBe(2);
  });
});

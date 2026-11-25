import { describe, expect, it } from 'vitest';
import { generateZSearchSteps } from './zSearch';

const matrix = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
];

describe('Z 字形查找教学分镜', () => {
  it('shows the elimination reason and reaches the target', () => {
    const steps = generateZSearchSteps(matrix, 5);
    expect(steps[0].operation).toBe('init');
    expect(steps[0].description).toContain('右上角');
    expect(steps[1].operation).toBe('eliminate_col');
    expect(steps[1].description).toContain('下面只会更大');
    expect(steps[steps.length - 1]?.comparison).toBe('found');
    expect(steps[steps.length - 1]?.found).toBe(true);
  });

  it('explains a missing value and finishes after crossing a boundary', () => {
    const steps = generateZSearchSteps(matrix, 20);
    expect(steps[steps.length - 1]?.operation).toBe('done');
    expect(steps[steps.length - 1]?.description).toContain('没有 20');
    expect(steps[steps.length - 1]?.found).toBe(false);
  });

  it('keeps step IDs and cell history deterministic', () => {
    const steps = generateZSearchSteps(matrix, 9);
    expect(steps.map((step) => step.id)).toEqual(steps.map((_, index) => index));
    expect(steps.every((step) => step.operation && step.narration && step.visitedCells)).toBe(true);
    expect(steps[1].visitedCells).toContain('0:4');
    expect(steps[2].visitedCells).toContain('0:3');
  });
});

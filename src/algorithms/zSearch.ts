import { AlgorithmStep } from '../types';

export function generateZSearchSteps(matrix: number[][], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const eliminatedRows: number[] = [];
  const eliminatedCols: number[] = [];
  const visitedCells: string[] = [];
  let row = 0;
  let col = cols - 1;

  const addStep = (
    description: string,
    operation: AlgorithmStep['operation'],
    comparison: AlgorithmStep['comparison'],
    found?: boolean
  ) => {
    const currentValue = row >= 0 && row < rows && col >= 0 && col < cols ? matrix[row][col] : -1;
    const position = row >= 0 && row < rows && col >= 0 && col < cols ? `${row}:${col}` : '';
    if (position && !visitedCells.includes(position)) visitedCells.push(position);
    // Keep the focus and its trail visible even when a large custom matrix is entered.
    const visibleHistory = visitedCells.slice(-144);
    const codeLines = operation === 'init'
      ? { java: [1, 2, 3], python: [1, 2], golang: [1, 2], javascript: [1, 2, 3] }
      : operation === 'eliminate_col'
        ? { java: [9, 10], python: [7, 8], golang: [8, 9], javascript: [9, 10] }
        : operation === 'eliminate_row'
          ? { java: [11, 12], python: [9, 10], golang: [10, 11], javascript: [11, 12] }
          : operation === 'match'
            ? { java: [6, 7], python: [5, 6], golang: [5, 6], javascript: [6, 7] }
            : { java: [15], python: [11], golang: [14], javascript: [15] };
    steps.push({
      id: steps.length,
      description,
      operation,
      narration: description,
      row: Math.min(Math.max(row, 0), rows - 1),
      col: Math.min(Math.max(col, 0), cols - 1),
      currentValue,
      target,
      comparison,
      searchRange: { rowStart: row, rowEnd: rows - 1, colStart: 0, colEnd: col },
      codeLines,
      variables: { x: row, y: col, row, col, 'matrix[x][y]': currentValue, target },
      found,
      animationType: found ? 'found' : comparison === 'not_found' ? 'not_found' : operation === 'init' ? 'init' : operation === 'eliminate_row' || operation === 'eliminate_col' ? operation : 'compare',
      eliminatedRows: [...eliminatedRows],
      eliminatedCols: [...eliminatedCols],
      visitedCells: visibleHistory
    });
  };

  addStep(
    `先看右上角：它是这一行最大的数，也是这一列最小的数。目标是 ${target}。`,
    'init',
    'init'
  );

  while (row < rows && col >= 0) {
    const value = matrix[row][col];
    const coordinate = `第 ${row + 1} 行、第 ${col + 1} 列`;

    if (value === target) {
      addStep(
        `找到目标！${coordinate} 的数是 ${value}，和目标 ${target} 相等，所以返回“找到”。`,
        'match',
        'found',
        true
      );
      return steps;
    }

    if (value > target) {
      eliminatedCols.push(col);
      addStep(
        `${coordinate} 是 ${value}，比目标 ${target} 大。它下面只会更大，所以整列都不可能；向左看。`,
        'eliminate_col',
        'greater'
      );
      col--;
    } else {
      eliminatedRows.push(row);
      addStep(
        `${coordinate} 是 ${value}，比目标 ${target} 小。它左边只会更小，所以整行都不可能；向下看。`,
        'eliminate_row',
        'less'
      );
      row++;
    }
  }

  addStep(
    `已经走出矩阵边界，剩下的位置都排除了，因此矩阵中没有 ${target}。`,
    'done',
    'not_found',
    false
  );
  return steps;
}

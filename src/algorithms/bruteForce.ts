import { AlgorithmStep } from '../types';

export function generateBruteForceSteps(matrix: number[][], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const m = matrix.length;
  const n = matrix[0].length;
  let stepId = 0;

  // 初始化步骤
  steps.push({
    id: stepId++,
    description: `开始暴力查找，目标值为 ${target}，矩阵大小 ${m}×${n}`,
    row: 0,
    col: 0,
    currentValue: matrix[0][0],
    target,
    comparison: 'init',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [1],
      python: [1],
      golang: [1],
      javascript: [1]
    },
    variables: {
      target,
      '矩阵大小': `${m}×${n}`
    },
    animationType: 'init',
    eliminatedRows: [],
    eliminatedCols: []
  });

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const currentValue = matrix[i][j];

      // 比较步骤
      if (currentValue === target) {
        steps.push({
          id: stepId++,
          description: `🎉 找到目标！matrix[${i}][${j}] = ${currentValue} == ${target}`,
          row: i,
          col: j,
          currentValue,
          target,
          comparison: 'found',
          searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
          codeLines: {
            java: [3, 4],
            python: [3, 4],
            golang: [3, 4],
            javascript: [3, 4]
          },
          variables: {
            i,
            j,
            element: currentValue,
            result: true
          },
          found: true,
          animationType: 'found',
          eliminatedRows: [],
          eliminatedCols: []
        });
        return steps;
      }

      steps.push({
        id: stepId++,
        description: `检查 matrix[${i}][${j}] = ${currentValue}，${currentValue} ≠ ${target}，继续`,
        row: i,
        col: j,
        currentValue,
        target,
        comparison: currentValue < target ? 'less' : 'greater',
        searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
        codeLines: {
          java: [2, 3],
          python: [2, 3],
          golang: [2, 3],
          javascript: [2, 3]
        },
        variables: {
          i,
          j,
          element: currentValue
        },
        animationType: 'compare',
        eliminatedRows: [],
        eliminatedCols: []
      });
    }
  }

  // 未找到
  steps.push({
    id: stepId++,
    description: `❌ 遍历完成，未找到目标值 ${target}`,
    row: m - 1,
    col: n - 1,
    currentValue: matrix[m - 1][n - 1],
    target,
    comparison: 'not_found',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [7],
      python: [5],
      golang: [8],
      javascript: [8]
    },
    variables: {
      result: false
    },
    found: false,
    animationType: 'not_found',
    eliminatedRows: [],
    eliminatedCols: []
  });

  return steps;
}

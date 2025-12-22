import { AlgorithmStep } from '../types';

export function generateBinarySearchSteps(matrix: number[][], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const m = matrix.length;
  const n = matrix[0].length;
  let stepId = 0;

  // 初始化步骤
  steps.push({
    id: stepId++,
    description: `开始二分查找，目标值为 ${target}，对每行进行二分搜索`,
    row: 0,
    col: Math.floor(n / 2),
    currentValue: matrix[0][Math.floor(n / 2)],
    target,
    comparison: 'init',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [1],
      python: [1],
      golang: [1],
      javascript: [11]
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
    const row = matrix[i];
    let left = 0;
    let right = n - 1;

    // 开始对当前行二分查找
    steps.push({
      id: stepId++,
      description: `对第 ${i + 1} 行进行二分查找，范围 [${left}, ${right}]`,
      row: i,
      col: Math.floor((left + right) / 2),
      currentValue: row[Math.floor((left + right) / 2)],
      target,
      comparison: 'init',
      searchRange: { rowStart: i, rowEnd: i, colStart: left, colEnd: right },
      codeLines: {
        java: [1, 2],
        python: [1, 2],
        golang: [1, 2],
        javascript: [11, 12]
      },
      variables: {
        row: i,
        left,
        right
      },
      animationType: 'move',
      eliminatedRows: [],
      eliminatedCols: []
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midValue = row[mid];

      if (midValue === target) {
        steps.push({
          id: stepId++,
          description: `🎉 找到目标！matrix[${i}][${mid}] = ${midValue} == ${target}`,
          row: i,
          col: mid,
          currentValue: midValue,
          target,
          comparison: 'found',
          searchRange: { rowStart: i, rowEnd: i, colStart: left, colEnd: right },
          codeLines: {
            java: [3, 4],
            python: [2, 3],
            golang: [3, 4],
            javascript: [12, 13]
          },
          variables: {
            row: i,
            mid,
            'arr[mid]': midValue,
            result: true
          },
          found: true,
          animationType: 'found',
          eliminatedRows: [],
          eliminatedCols: []
        });
        return steps;
      } else if (midValue < target) {
        steps.push({
          id: stepId++,
          description: `matrix[${i}][${mid}] = ${midValue} < ${target}，搜索右半部分`,
          row: i,
          col: mid,
          currentValue: midValue,
          target,
          comparison: 'less',
          searchRange: { rowStart: i, rowEnd: i, colStart: mid + 1, colEnd: right },
          codeLines: {
            java: [2],
            python: [2],
            golang: [2],
            javascript: [12]
          },
          variables: {
            row: i,
            left,
            right,
            mid,
            'arr[mid]': midValue,
            '新left': mid + 1
          },
          animationType: 'compare',
          eliminatedRows: [],
          eliminatedCols: []
        });
        left = mid + 1;
      } else {
        steps.push({
          id: stepId++,
          description: `matrix[${i}][${mid}] = ${midValue} > ${target}，搜索左半部分`,
          row: i,
          col: mid,
          currentValue: midValue,
          target,
          comparison: 'greater',
          searchRange: { rowStart: i, rowEnd: i, colStart: left, colEnd: mid - 1 },
          codeLines: {
            java: [2],
            python: [2],
            golang: [2],
            javascript: [12]
          },
          variables: {
            row: i,
            left,
            right,
            mid,
            'arr[mid]': midValue,
            '新right': mid - 1
          },
          animationType: 'compare',
          eliminatedRows: [],
          eliminatedCols: []
        });
        right = mid - 1;
      }
    }

    // 当前行未找到
    steps.push({
      id: stepId++,
      description: `第 ${i + 1} 行未找到目标值，继续下一行`,
      row: i,
      col: Math.floor(n / 2),
      currentValue: row[Math.floor(n / 2)],
      target,
      comparison: 'less',
      searchRange: { rowStart: i + 1, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
      codeLines: {
        java: [1],
        python: [1],
        golang: [1],
        javascript: [11]
      },
      variables: {
        row: i,
        '结果': '未找到'
      },
      animationType: 'eliminate_row',
      eliminatedRows: [i],
      eliminatedCols: []
    });
  }

  // 未找到
  steps.push({
    id: stepId++,
    description: `❌ 所有行都已搜索，未找到目标值 ${target}`,
    row: m - 1,
    col: Math.floor(n / 2),
    currentValue: matrix[m - 1][Math.floor(n / 2)],
    target,
    comparison: 'not_found',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [7],
      python: [4],
      golang: [7],
      javascript: [16]
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

import { AlgorithmStep } from '../types';

export function generateZSearchSteps(matrix: number[][], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const m = matrix.length;
  const n = matrix[0].length;
  let stepId = 0;
  
  const eliminatedRows: number[] = [];
  const eliminatedCols: number[] = [];

  // 初始化步骤
  steps.push({
    id: stepId++,
    description: `初始化：从右上角 (0, ${n - 1}) 开始搜索，目标值为 ${target}`,
    row: 0,
    col: n - 1,
    currentValue: matrix[0][n - 1],
    target,
    comparison: 'init',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [1, 2, 3],
      python: [1, 2],
      golang: [1, 2],
      javascript: [1, 2, 3]
    },
    variables: {
      m,
      n,
      x: 0,
      y: n - 1,
      target
    },
    animationType: 'init',
    eliminatedRows: [...eliminatedRows],
    eliminatedCols: [...eliminatedCols]
  });

  let x = 0;
  let y = n - 1;

  while (x < m && y >= 0) {
    const currentValue = matrix[x][y];
    
    // 循环条件检查
    steps.push({
      id: stepId++,
      description: `检查循环条件：x=${x} < m=${m} 且 y=${y} >= 0，条件满足`,
      row: x,
      col: y,
      currentValue,
      target,
      comparison: 'init',
      searchRange: { 
        rowStart: x, 
        rowEnd: m - 1, 
        colStart: 0, 
        colEnd: y 
      },
      codeLines: {
        java: [5],
        python: [4],
        golang: [4],
        javascript: [5]
      },
      variables: {
        x,
        y,
        'm': m,
        'matrix[x][y]': currentValue
      },
      animationType: 'move',
      eliminatedRows: [...eliminatedRows],
      eliminatedCols: [...eliminatedCols]
    });

    if (currentValue === target) {
      // 找到目标
      steps.push({
        id: stepId++,
        description: `🎉 找到目标！matrix[${x}][${y}] = ${currentValue} == ${target}`,
        row: x,
        col: y,
        currentValue,
        target,
        comparison: 'found',
        searchRange: { rowStart: x, rowEnd: m - 1, colStart: 0, colEnd: y },
        codeLines: {
          java: [6, 7],
          python: [5, 6],
          golang: [5, 6],
          javascript: [6, 7]
        },
        variables: {
          x,
          y,
          'matrix[x][y]': currentValue,
          result: true
        },
        found: true,
        animationType: 'found',
        eliminatedRows: [...eliminatedRows],
        eliminatedCols: [...eliminatedCols]
      });
      return steps;
    } else if (currentValue > target) {
      // 当前值大于目标，向左移动
      steps.push({
        id: stepId++,
        description: `比较：matrix[${x}][${y}] = ${currentValue} > ${target}，排除第 ${y + 1} 列，向左移动`,
        row: x,
        col: y,
        currentValue,
        target,
        comparison: 'greater',
        searchRange: { rowStart: x, rowEnd: m - 1, colStart: 0, colEnd: y },
        codeLines: {
          java: [9, 10],
          python: [7, 8],
          golang: [8, 9],
          javascript: [9, 10]
        },
        variables: {
          x,
          y,
          'matrix[x][y]': currentValue,
          '比较结果': `${currentValue} > ${target}`
        },
        animationType: 'eliminate_col',
        eliminatedRows: [...eliminatedRows],
        eliminatedCols: [...eliminatedCols, y]
      });
      eliminatedCols.push(y);
      y--;
    } else {
      // 当前值小于目标，向下移动
      steps.push({
        id: stepId++,
        description: `比较：matrix[${x}][${y}] = ${currentValue} < ${target}，排除第 ${x + 1} 行，向下移动`,
        row: x,
        col: y,
        currentValue,
        target,
        comparison: 'less',
        searchRange: { rowStart: x, rowEnd: m - 1, colStart: 0, colEnd: y },
        codeLines: {
          java: [11, 12],
          python: [9, 10],
          golang: [10, 11],
          javascript: [11, 12]
        },
        variables: {
          x,
          y,
          'matrix[x][y]': currentValue,
          '比较结果': `${currentValue} < ${target}`
        },
        animationType: 'eliminate_row',
        eliminatedRows: [...eliminatedRows, x],
        eliminatedCols: [...eliminatedCols]
      });
      eliminatedRows.push(x);
      x++;
    }
  }

  // 未找到目标
  steps.push({
    id: stepId++,
    description: `❌ 搜索结束，未找到目标值 ${target}。x=${x} 或 y=${y} 越界`,
    row: Math.min(x, m - 1),
    col: Math.max(y, 0),
    currentValue: -1,
    target,
    comparison: 'not_found',
    searchRange: { rowStart: 0, rowEnd: m - 1, colStart: 0, colEnd: n - 1 },
    codeLines: {
      java: [15],
      python: [11],
      golang: [14],
      javascript: [15]
    },
    variables: {
      x,
      y,
      result: false
    },
    found: false,
    animationType: 'not_found',
    eliminatedRows: [...eliminatedRows],
    eliminatedCols: [...eliminatedCols]
  });

  return steps;
}

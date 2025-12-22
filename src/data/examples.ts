import { ExampleData } from '../types';

export const exampleData: ExampleData[] = [
  {
    name: '示例1 (找到)',
    matrix: [
      [1, 4, 7, 11, 15],
      [2, 5, 8, 12, 19],
      [3, 6, 9, 16, 22],
      [10, 13, 14, 17, 24],
      [18, 21, 23, 26, 30]
    ],
    target: 5,
    expected: true
  },
  {
    name: '示例2 (未找到)',
    matrix: [
      [1, 4, 7, 11, 15],
      [2, 5, 8, 12, 19],
      [3, 6, 9, 16, 22],
      [10, 13, 14, 17, 24],
      [18, 21, 23, 26, 30]
    ],
    target: 20,
    expected: false
  },
  {
    name: '小矩阵',
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    target: 5,
    expected: true
  },
  {
    name: '单行矩阵',
    matrix: [
      [1, 3, 5, 7, 9]
    ],
    target: 5,
    expected: true
  },
  {
    name: '单列矩阵',
    matrix: [
      [1],
      [3],
      [5],
      [7],
      [9]
    ],
    target: 7,
    expected: true
  },
  {
    name: '边界值',
    matrix: [
      [1, 4, 7, 11, 15],
      [2, 5, 8, 12, 19],
      [3, 6, 9, 16, 22],
      [10, 13, 14, 17, 24],
      [18, 21, 23, 26, 30]
    ],
    target: 30,
    expected: true
  }
];

// 生成随机有效矩阵
export function generateRandomMatrix(rows: number, cols: number): number[][] {
  const matrix: number[][] = [];
  
  // 生成第一行
  const prevRow: number[] = [];
  let current = Math.floor(Math.random() * 10) + 1;
  for (let j = 0; j < cols; j++) {
    prevRow.push(current);
    current += Math.floor(Math.random() * 5) + 1;
  }
  matrix.push(prevRow);
  
  // 生成后续行
  for (let i = 1; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const minVal = Math.max(
        matrix[i - 1][j] + 1,
        j > 0 ? row[j - 1] + 1 : 1
      );
      row.push(minVal + Math.floor(Math.random() * 5));
    }
    matrix.push(row);
  }
  
  return matrix;
}

// 从矩阵中随机选择一个目标值
export function getRandomTarget(matrix: number[][], shouldExist: boolean): number {
  if (shouldExist) {
    const row = Math.floor(Math.random() * matrix.length);
    const col = Math.floor(Math.random() * matrix[0].length);
    return matrix[row][col];
  } else {
    // 生成一个不存在的值
    const allValues = new Set(matrix.flat());
    const min = matrix[0][0];
    const max = matrix[matrix.length - 1][matrix[0].length - 1];
    
    let target: number;
    do {
      target = Math.floor(Math.random() * (max - min + 20)) + min - 10;
    } while (allValues.has(target));
    
    return target;
  }
}

// 验证矩阵是否有效
export function validateMatrix(matrix: number[][]): { valid: boolean; error?: string } {
  if (!matrix || matrix.length === 0) {
    return { valid: false, error: '矩阵不能为空' };
  }
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  if (rows > 300 || cols > 300) {
    return { valid: false, error: '矩阵维度不能超过300' };
  }
  
  // 检查每行长度一致
  for (let i = 0; i < rows; i++) {
    if (matrix[i].length !== cols) {
      return { valid: false, error: '矩阵每行长度必须一致' };
    }
  }
  
  // 检查行升序
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][j] <= matrix[i][j - 1]) {
        return { valid: false, error: `第${i + 1}行不是严格升序` };
      }
    }
  }
  
  // 检查列升序
  for (let j = 0; j < cols; j++) {
    for (let i = 1; i < rows; i++) {
      if (matrix[i][j] <= matrix[i - 1][j]) {
        return { valid: false, error: `第${j + 1}列不是严格升序` };
      }
    }
  }
  
  return { valid: true };
}

// 解析用户输入的矩阵
export function parseMatrixInput(input: string): { matrix: number[][] | null; error?: string } {
  try {
    // 尝试解析JSON格式
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed) && parsed.every(row => Array.isArray(row))) {
      const validation = validateMatrix(parsed);
      if (!validation.valid) {
        return { matrix: null, error: validation.error };
      }
      return { matrix: parsed };
    }
    return { matrix: null, error: '输入格式不正确' };
  } catch {
    return { matrix: null, error: '无法解析输入，请使用JSON格式' };
  }
}

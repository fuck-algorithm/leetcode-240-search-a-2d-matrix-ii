// 算法步骤类型
export interface AlgorithmStep {
  id: number;
  description: string;
  // 当前位置
  row: number;
  col: number;
  // 当前值
  currentValue: number;
  // 目标值
  target: number;
  // 比较结果: 'equal' | 'greater' | 'less'
  comparison: 'equal' | 'greater' | 'less' | 'init' | 'found' | 'not_found';
  // 搜索范围
  searchRange: {
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
  };
  // 代码行号映射 (语言 -> 行号数组)
  codeLines: {
    java: number[];
    python: number[];
    golang: number[];
    javascript: number[];
  };
  // 变量状态
  variables: {
    [key: string]: string | number | boolean;
  };
  // 是否找到
  found?: boolean;
  // 动画类型
  animationType: 'move' | 'compare' | 'eliminate_row' | 'eliminate_col' | 'found' | 'not_found' | 'init';
  // 被排除的行/列
  eliminatedRows?: number[];
  eliminatedCols?: number[];
}

// 算法类型
export type AlgorithmType = 'brute_force' | 'binary_search' | 'z_search';

// 算法信息
export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  nameEn: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

// 代码语言
export type CodeLanguage = 'java' | 'python' | 'golang' | 'javascript';

// 播放状态
export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
}

// 矩阵单元格状态
export interface CellState {
  value: number;
  row: number;
  col: number;
  state: 'normal' | 'current' | 'visited' | 'eliminated' | 'found' | 'target';
}

// 输入数据
export interface InputData {
  matrix: number[][];
  target: number;
}

// 示例数据
export interface ExampleData {
  name: string;
  matrix: number[][];
  target: number;
  expected: boolean;
}

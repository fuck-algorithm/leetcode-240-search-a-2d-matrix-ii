import { AlgorithmType, CodeLanguage } from '../types';

// Z字形查找算法代码
const zSearchCode: Record<CodeLanguage, string> = {
  java: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length;
    int n = matrix[0].length;
    int x = 0, y = n - 1;
    
    while (x < m && y >= 0) {
        if (matrix[x][y] == target) {
            return true;
        }
        if (matrix[x][y] > target) {
            --y;
        } else {
            ++x;
        }
    }
    return false;
}`,
  python: `def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    x, y = 0, n - 1
    
    while x < m and y >= 0:
        if matrix[x][y] == target:
            return True
        if matrix[x][y] > target:
            y -= 1
        else:
            x += 1
    return False`,
  golang: `func searchMatrix(matrix [][]int, target int) bool {
    m, n := len(matrix), len(matrix[0])
    x, y := 0, n-1
    
    for x < m && y >= 0 {
        if matrix[x][y] == target {
            return true
        }
        if matrix[x][y] > target {
            y--
        } else {
            x++
        }
    }
    return false
}`,
  javascript: `var searchMatrix = function(matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;
    let x = 0, y = n - 1;
    
    while (x < m && y >= 0) {
        if (matrix[x][y] === target) {
            return true;
        }
        if (matrix[x][y] > target) {
            y--;
        } else {
            x++;
        }
    }
    return false;
};`
};

// 暴力查找算法代码
const bruteForceCode: Record<CodeLanguage, string> = {
  java: `public boolean searchMatrix(int[][] matrix, int target) {
    for (int[] row : matrix) {
        for (int element : row) {
            if (element == target) {
                return true;
            }
        }
    }
    return false;
}`,
  python: `def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
    for row in matrix:
        for element in row:
            if element == target:
                return True
    return False`,
  golang: `func searchMatrix(matrix [][]int, target int) bool {
    for _, row := range matrix {
        for _, element := range row {
            if element == target {
                return true
            }
        }
    }
    return false
}`,
  javascript: `var searchMatrix = function(matrix, target) {
    for (const row of matrix) {
        for (const element of row) {
            if (element === target) {
                return true;
            }
        }
    }
    return false;
};`
};

// 二分查找算法代码
const binarySearchCode: Record<CodeLanguage, string> = {
  java: `public boolean searchMatrix(int[][] matrix, int target) {
    for (int[] row : matrix) {
        int index = binarySearch(row, target);
        if (index >= 0) {
            return true;
        }
    }
    return false;
}

private int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
  python: `def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
    for row in matrix:
        idx = bisect_left(row, target)
        if idx < len(row) and row[idx] == target:
            return True
    return False`,
  golang: `func searchMatrix(matrix [][]int, target int) bool {
    for _, row := range matrix {
        idx := sort.SearchInts(row, target)
        if idx < len(row) && row[idx] == target {
            return true
        }
    }
    return false
}`,
  javascript: `var searchMatrix = function(matrix, target) {
    const binarySearch = (arr, target) => {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    };
    
    for (const row of matrix) {
        if (binarySearch(row, target) >= 0) {
            return true;
        }
    }
    return false;
};`
};

export const algorithmCodes: Record<AlgorithmType, Record<CodeLanguage, string>> = {
  z_search: zSearchCode,
  brute_force: bruteForceCode,
  binary_search: binarySearchCode
};

// 代码行号映射（用于高亮）
export const codeLineMapping: Record<AlgorithmType, Record<CodeLanguage, Record<string, number[]>>> = {
  z_search: {
    java: {
      init: [1, 2, 3],
      loop_check: [5],
      compare_equal: [6, 7],
      compare_greater: [9, 10],
      compare_less: [11, 12],
      return_false: [15]
    },
    python: {
      init: [1, 2],
      loop_check: [4],
      compare_equal: [5, 6],
      compare_greater: [7, 8],
      compare_less: [9, 10],
      return_false: [11]
    },
    golang: {
      init: [1, 2],
      loop_check: [4],
      compare_equal: [5, 6],
      compare_greater: [8, 9],
      compare_less: [10, 11],
      return_false: [14]
    },
    javascript: {
      init: [1, 2, 3],
      loop_check: [5],
      compare_equal: [6, 7],
      compare_greater: [9, 10],
      compare_less: [11, 12],
      return_false: [15]
    }
  },
  brute_force: {
    java: {
      outer_loop: [1],
      inner_loop: [2],
      compare: [3, 4],
      return_false: [7]
    },
    python: {
      outer_loop: [1],
      inner_loop: [2],
      compare: [3, 4],
      return_false: [5]
    },
    golang: {
      outer_loop: [1],
      inner_loop: [2],
      compare: [3, 4],
      return_false: [8]
    },
    javascript: {
      outer_loop: [1],
      inner_loop: [2],
      compare: [3, 4],
      return_false: [8]
    }
  },
  binary_search: {
    java: {
      outer_loop: [1],
      binary_search: [2],
      found: [3, 4],
      return_false: [7]
    },
    python: {
      outer_loop: [1],
      binary_search: [2],
      found: [3],
      return_false: [4]
    },
    golang: {
      outer_loop: [1],
      binary_search: [2],
      found: [3, 4],
      return_false: [7]
    },
    javascript: {
      outer_loop: [11],
      binary_search: [12],
      found: [13],
      return_false: [16]
    }
  }
};

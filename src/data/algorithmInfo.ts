import { AlgorithmInfo, AlgorithmType } from '../types';

export const algorithmInfos: Record<AlgorithmType, AlgorithmInfo> = {
  brute_force: {
    id: 'brute_force',
    name: '暴力查找',
    nameEn: 'Brute Force',
    timeComplexity: 'O(mn)',
    spaceComplexity: 'O(1)',
    description: `## 暴力查找

### 思路
直接遍历整个矩阵，逐个检查每个元素是否等于目标值。

### 算法步骤
1. 遍历矩阵的每一行
2. 对于每一行，遍历每个元素
3. 如果找到目标值，返回 true
4. 遍历完成后仍未找到，返回 false

### 复杂度分析
- **时间复杂度**: O(mn)，需要遍历整个矩阵
- **空间复杂度**: O(1)，只使用常数额外空间

### 优缺点
- ✅ 实现简单，易于理解
- ❌ 没有利用矩阵的有序性质
- ❌ 时间复杂度较高`
  },
  binary_search: {
    id: 'binary_search',
    name: '二分查找',
    nameEn: 'Binary Search',
    timeComplexity: 'O(m·log n)',
    spaceComplexity: 'O(1)',
    description: `## 二分查找

### 思路
利用每一行元素升序排列的特性，对每一行进行二分查找。

### 算法步骤
1. 遍历矩阵的每一行
2. 对当前行使用二分查找
3. 如果在某行找到目标值，返回 true
4. 所有行都查找完毕后仍未找到，返回 false

### 复杂度分析
- **时间复杂度**: O(m·log n)，对每行进行二分查找
- **空间复杂度**: O(1)，只使用常数额外空间

### 优缺点
- ✅ 利用了行内有序的特性
- ✅ 比暴力查找更高效
- ❌ 没有充分利用列有序的特性`
  },
  z_search: {
    id: 'z_search',
    name: 'Z字形查找',
    nameEn: 'Z-shaped Search',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    description: `## Z字形查找（最优解）

### 思路
从矩阵的右上角开始搜索，利用矩阵行列都有序的特性，每次可以排除一行或一列。

### 核心观察
从右上角 (0, n-1) 位置开始：
- 当前元素是该行最大值
- 当前元素是该列最小值

### 算法步骤
1. 从右上角 (0, n-1) 开始
2. 如果当前值等于目标值，返回 true
3. 如果当前值大于目标值，向左移动（排除当前列）
4. 如果当前值小于目标值，向下移动（排除当前行）
5. 超出边界则返回 false

### 复杂度分析
- **时间复杂度**: O(m + n)，最多移动 m + n 次
- **空间复杂度**: O(1)，只使用常数额外空间

### 为什么从右上角开始？
- 右上角元素是该行最大、该列最小
- 可以根据比较结果明确排除一行或一列
- 左下角同理，但右上角更直观`
  }
};

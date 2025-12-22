import { useState, useCallback } from 'react';
import { AlgorithmType, InputData } from '../../types';
import { exampleData, generateRandomMatrix, getRandomTarget, parseMatrixInput } from '../../data/examples';
import { algorithmInfos } from '../../data/algorithmInfo';
import styles from './InputPanel.module.css';

interface InputPanelProps {
  onDataChange: (data: InputData) => void;
  currentAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
}

export function InputPanel({ onDataChange, currentAlgorithm, onAlgorithmChange }: InputPanelProps) {
  const [matrixInput, setMatrixInput] = useState<string>(JSON.stringify(exampleData[0].matrix));
  const [targetInput, setTargetInput] = useState<string>(String(exampleData[0].target));
  const [error, setError] = useState<string>('');

  const handleApply = useCallback(() => {
    const result = parseMatrixInput(matrixInput);
    if (!result.matrix) {
      setError(result.error || '输入格式错误');
      return;
    }

    const target = parseInt(targetInput, 10);
    if (isNaN(target)) {
      setError('目标值必须是数字');
      return;
    }

    setError('');
    onDataChange({ matrix: result.matrix, target });
  }, [matrixInput, targetInput, onDataChange]);

  const handleExampleClick = useCallback((example: typeof exampleData[0]) => {
    setMatrixInput(JSON.stringify(example.matrix));
    setTargetInput(String(example.target));
    setError('');
    onDataChange({ matrix: example.matrix, target: example.target });
  }, [onDataChange]);

  const handleRandomGenerate = useCallback(() => {
    const rows = Math.floor(Math.random() * 4) + 3; // 3-6行
    const cols = Math.floor(Math.random() * 4) + 3; // 3-6列
    const matrix = generateRandomMatrix(rows, cols);
    const shouldExist = Math.random() > 0.3; // 70%概率存在
    const target = getRandomTarget(matrix, shouldExist);
    
    setMatrixInput(JSON.stringify(matrix));
    setTargetInput(String(target));
    setError('');
    onDataChange({ matrix, target });
  }, [onDataChange]);

  const algorithms: AlgorithmType[] = ['z_search', 'binary_search', 'brute_force'];

  return (
    <div className={styles.container}>
      <div className={styles.algorithmSelector}>
        <span className={styles.label}>算法：</span>
        <div className={styles.algorithmTabs}>
          {algorithms.map((algo) => (
            <button
              key={algo}
              className={`${styles.algorithmTab} ${currentAlgorithm === algo ? styles.active : ''}`}
              onClick={() => onAlgorithmChange(algo)}
            >
              {algorithmInfos[algo].name}
              <span className={styles.complexity}>{algorithmInfos[algo].timeComplexity}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>矩阵：</label>
          <input
            type="text"
            value={matrixInput}
            onChange={(e) => setMatrixInput(e.target.value)}
            className={styles.input}
            placeholder="[[1,4,7],[2,5,8],[3,6,9]]"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>目标值：</label>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className={styles.targetInput}
          />
        </div>

        <button className={styles.applyButton} onClick={handleApply}>
          应用
        </button>

        <button className={styles.randomButton} onClick={handleRandomGenerate}>
          🎲 随机
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.examples}>
        <span className={styles.label}>示例：</span>
        <div className={styles.exampleButtons}>
          {exampleData.map((example, index) => (
            <button
              key={index}
              className={styles.exampleButton}
              onClick={() => handleExampleClick(example)}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

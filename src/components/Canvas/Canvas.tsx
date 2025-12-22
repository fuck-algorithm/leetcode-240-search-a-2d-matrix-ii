import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { AlgorithmStep } from '../../types';
import styles from './Canvas.module.css';

interface CanvasProps {
  matrix: number[][];
  target: number;
  currentStep: AlgorithmStep | null;
}

export function Canvas({ matrix, target, currentStep }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  // 计算单元格大小
  const getCellSize = useCallback(() => {
    if (!containerRef.current) return 50;
    const containerWidth = containerRef.current.clientWidth - 100;
    const containerHeight = containerRef.current.clientHeight - 150;
    const maxCellWidth = containerWidth / (cols + 1);
    const maxCellHeight = containerHeight / (rows + 2);
    return Math.min(Math.max(Math.min(maxCellWidth, maxCellHeight), 35), 60);
  }, [rows, cols]);

  const drawMatrix = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cellSize = getCellSize();
    const matrixWidth = cols * cellSize;
    const matrixHeight = rows * cellSize;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const offsetX = (containerWidth - matrixWidth) / 2 + transform.x;
    const offsetY = (containerHeight - matrixHeight) / 2 + transform.y - 20;

    const g = svg.append('g')
      .attr('transform', `translate(${offsetX}, ${offsetY}) scale(${transform.scale})`);

    // 绘制目标值提示
    g.append('text')
      .attr('x', matrixWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffc107')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`目标值: ${target}`);

    // 绘制列索引
    for (let j = 0; j < cols; j++) {
      g.append('text')
        .attr('x', j * cellSize + cellSize / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#888')
        .attr('font-size', '11px')
        .text(j);
    }

    // 绘制行索引
    for (let i = 0; i < rows; i++) {
      g.append('text')
        .attr('x', -15)
        .attr('y', i * cellSize + cellSize / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#888')
        .attr('font-size', '11px')
        .text(i);
    }

    // 绘制单元格
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = matrix[i][j];
        const isCurrent = currentStep && currentStep.row === i && currentStep.col === j;
        const isEliminated = currentStep?.eliminatedRows?.includes(i) || 
                           currentStep?.eliminatedCols?.includes(j);
        const isFound = currentStep?.comparison === 'found' && isCurrent;
        const isTarget = value === target && !isFound;

        let fillColor = 'rgba(255, 255, 255, 0.1)';
        let strokeColor = 'rgba(255, 255, 255, 0.2)';
        let textColor = '#e8e8e8';

        if (isEliminated) {
          fillColor = 'rgba(100, 100, 100, 0.2)';
          textColor = '#666';
          strokeColor = 'rgba(100, 100, 100, 0.3)';
        }
        if (isTarget) {
          strokeColor = '#ffc107';
          fillColor = 'rgba(255, 193, 7, 0.1)';
        }
        if (isCurrent && !isFound) {
          fillColor = 'rgba(33, 150, 243, 0.3)';
          strokeColor = '#2196f3';
          textColor = '#fff';
        }
        if (isFound) {
          fillColor = 'rgba(76, 175, 80, 0.4)';
          strokeColor = '#4caf50';
          textColor = '#fff';
        }

        // 单元格背景
        g.append('rect')
          .attr('x', j * cellSize + 2)
          .attr('y', i * cellSize + 2)
          .attr('width', cellSize - 4)
          .attr('height', cellSize - 4)
          .attr('rx', 4)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor)
          .attr('stroke-width', isCurrent || isFound ? 2 : 1);

        // 单元格值
        g.append('text')
          .attr('x', j * cellSize + cellSize / 2)
          .attr('y', i * cellSize + cellSize / 2 + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', textColor)
          .attr('font-size', cellSize > 45 ? '14px' : '12px')
          .attr('font-weight', isCurrent || isFound ? 'bold' : 'normal')
          .text(value);
      }
    }

    // 绘制当前位置指示器
    if (currentStep && currentStep.row >= 0 && currentStep.col >= 0 && 
        currentStep.row < rows && currentStep.col < cols) {
      const cx = currentStep.col * cellSize + cellSize / 2;
      const cy = currentStep.row * cellSize + cellSize / 2;

      // 指针标签
      g.append('text')
        .attr('x', cx)
        .attr('y', cy - cellSize / 2 - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#2196f3')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(`(${currentStep.row}, ${currentStep.col})`);
    }

    // 绘制搜索范围指示
    if (currentStep && currentStep.searchRange) {
      const { rowStart, rowEnd, colStart, colEnd } = currentStep.searchRange;
      const rangeX = colStart * cellSize;
      const rangeY = rowStart * cellSize;
      const rangeWidth = (colEnd - colStart + 1) * cellSize;
      const rangeHeight = (rowEnd - rowStart + 1) * cellSize;

      g.append('rect')
        .attr('x', rangeX)
        .attr('y', rangeY)
        .attr('width', rangeWidth)
        .attr('height', rangeHeight)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(76, 175, 80, 0.5)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('rx', 4);
    }

    // 绘制步骤描述
    if (currentStep) {
      g.append('text')
        .attr('x', matrixWidth / 2)
        .attr('y', matrixHeight + 30)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '13px')
        .text(currentStep.description);

      // 比较结果指示
      if (currentStep.comparison !== 'init' && currentStep.comparison !== 'found' && 
          currentStep.comparison !== 'not_found') {
        const comparisonText = currentStep.comparison === 'greater' 
          ? `${currentStep.currentValue} > ${target} → 向左` 
          : `${currentStep.currentValue} < ${target} → 向下`;
        
        g.append('text')
          .attr('x', matrixWidth / 2)
          .attr('y', matrixHeight + 50)
          .attr('text-anchor', 'middle')
          .attr('fill', currentStep.comparison === 'greater' ? '#ff9800' : '#03a9f4')
          .attr('font-size', '12px')
          .text(comparisonText);
      }
    }

    // 绘制变量状态
    if (currentStep?.variables) {
      const vars = currentStep.variables;
      const varTexts: string[] = [];
      
      if ('x' in vars) varTexts.push(`x=${vars.x}`);
      if ('y' in vars) varTexts.push(`y=${vars.y}`);
      if ('matrix[x][y]' in vars) varTexts.push(`当前值=${vars['matrix[x][y]']}`);
      
      if (varTexts.length > 0) {
        g.append('text')
          .attr('x', matrixWidth / 2)
          .attr('y', matrixHeight + 70)
          .attr('text-anchor', 'middle')
          .attr('fill', '#aaa')
          .attr('font-size', '11px')
          .text(varTexts.join('  |  '));
      }
    }

  }, [matrix, target, currentStep, transform, getCellSize, rows, cols]);

  useEffect(() => {
    drawMatrix();
  }, [drawMatrix]);

  // 处理拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.clientX - transform.x;
    const startY = e.clientY - transform.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setTransform(prev => ({
        ...prev,
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [transform.x, transform.y]);

  // 处理缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.5), 2)
    }));
  }, []);

  // 重置视图
  const handleReset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.controls}>
        <button className={styles.resetButton} onClick={handleReset}>
          重置视图
        </button>
        <span className={styles.hint}>拖拽移动 | 滚轮缩放</span>
      </div>
      <svg
        ref={svgRef}
        className={styles.svg}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      />
    </div>
  );
}

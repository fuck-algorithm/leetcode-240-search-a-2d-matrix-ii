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

  const drawMatrix = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const cellSize = Math.max(18, Math.min(60, (width - 120) / Math.max(cols, 1), (height - 170) / Math.max(rows, 1)));
    const matrixWidth = cols * cellSize;
    const matrixHeight = rows * cellSize;
    const offsetX = (width - matrixWidth) / 2 + transform.x;
    const offsetY = (height - matrixHeight) / 2 + transform.y;

    let zoomLayer = svg.select<SVGGElement>('.zoom-layer');
    if (zoomLayer.empty()) zoomLayer = svg.append('g').attr('class', 'zoom-layer');
    zoomLayer.interrupt('view').attr('transform', `translate(${offsetX},${offsetY}) scale(${transform.scale})`);

    let gridLayer = zoomLayer.select<SVGGElement>('.layer-grid');
    if (gridLayer.empty()) gridLayer = zoomLayer.append('g').attr('class', 'layer-grid');
    let trailLayer = zoomLayer.select<SVGGElement>('.layer-trail');
    if (trailLayer.empty()) trailLayer = zoomLayer.append('g').attr('class', 'layer-trail');
    let cellLayer = zoomLayer.select<SVGGElement>('.layer-cells');
    if (cellLayer.empty()) cellLayer = zoomLayer.append('g').attr('class', 'layer-cells');
    let focusLayer = zoomLayer.select<SVGGElement>('.layer-focus');
    if (focusLayer.empty()) focusLayer = zoomLayer.append('g').attr('class', 'layer-focus');

    const cellData = matrix.flatMap((values, row) => values.map((value, col) => ({ row, col, value, id: `${row}:${col}` })));
    const visited = new Set(currentStep?.visitedCells ?? []);
    const excludedRows = new Set(currentStep?.eliminatedRows ?? []);
    const excludedCols = new Set(currentStep?.eliminatedCols ?? []);
    const isFocused = (cell: { row: number; col: number }) => currentStep?.row === cell.row && currentStep?.col === cell.col && currentStep?.comparison !== 'not_found';
    const isFound = (cell: { row: number; col: number }) => isFocused(cell) && currentStep?.comparison === 'found';

    gridLayer.selectAll('text.column-index').data(d3.range(cols), (d) => String(d)).join('text')
      .attr('class', 'column-index').attr('x', (col) => col * cellSize + cellSize / 2).attr('y', -10)
      .attr('text-anchor', 'middle').attr('fill', '#82928e').attr('font-size', Math.min(12, cellSize * 0.28)).text((col) => `列 ${col + 1}`);
    gridLayer.selectAll('text.row-index').data(d3.range(rows), (d) => String(d)).join('text')
      .attr('class', 'row-index').attr('x', -12).attr('y', (row) => row * cellSize + cellSize / 2 + 4)
      .attr('text-anchor', 'end').attr('fill', '#82928e').attr('font-size', Math.min(12, cellSize * 0.28)).text((row) => `行 ${row + 1}`);

    trailLayer.selectAll<SVGCircleElement, typeof cellData[number]>('circle.trail-dot').data(cellData.filter((cell) => visited.has(cell.id) && !isFocused(cell)), (cell) => cell.id).join('circle')
      .attr('class', 'trail-dot').attr('cx', (cell) => cell.col * cellSize + cellSize - 7).attr('cy', (cell) => cell.row * cellSize + 7)
      .attr('r', Math.max(2, cellSize * 0.065)).attr('fill', '#9ad3c2').attr('aria-label', '已经检查过');

    const cells = cellLayer.selectAll<SVGGElement, typeof cellData[number]>('g.matrix-cell')
      .data(cellData, (cell) => cell.id)
      .join(
        (enter) => {
          const group = enter.append('g').attr('class', 'matrix-cell').attr('data-cell-id', (cell) => cell.id)
            .attr('transform', (cell) => `translate(${cell.col * cellSize},${cell.row * cellSize})`).attr('opacity', 0);
          group.append('rect').attr('rx', Math.max(4, cellSize * 0.12));
          group.append('text').attr('class', 'cell-value').attr('text-anchor', 'middle').attr('dominant-baseline', 'central');
          return group;
        },
        (update) => update,
        (exit) => exit.interrupt('move').transition('exit').duration(100).attr('opacity', 0).remove()
      );

    cells.interrupt('exit').interrupt('move').transition('move').duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160)
      .attr('transform', (cell) => `translate(${cell.col * cellSize},${cell.row * cellSize})`).attr('opacity', 1);
    cells.attr('data-status', (cell) => isFound(cell) ? 'found' : isFocused(cell) ? 'current' : excludedRows.has(cell.row) || excludedCols.has(cell.col) ? 'excluded' : visited.has(cell.id) ? 'visited' : cell.value === target ? 'target' : 'idle');
    cells.select('rect').attr('x', 1).attr('y', 1).attr('width', Math.max(1, cellSize - 2)).attr('height', Math.max(1, cellSize - 2))
      .attr('fill', (cell) => isFound(cell) ? '#18765a' : isFocused(cell) ? '#e8b04b' : excludedRows.has(cell.row) || excludedCols.has(cell.col) ? '#24312f' : visited.has(cell.id) ? '#31564d' : cell.value === target ? '#285a4c' : '#1b2927')
      .attr('stroke', (cell) => isFound(cell) ? '#9ad3c2' : isFocused(cell) ? '#fff0c2' : cell.value === target ? '#2f9e7d' : '#40534f')
      .attr('stroke-width', (cell) => isFocused(cell) || isFound(cell) || cell.value === target ? 2 : 1);
    cells.select('text.cell-value').attr('x', cellSize / 2).attr('y', cellSize / 2).attr('fill', (cell) => excludedRows.has(cell.row) || excludedCols.has(cell.col) ? '#70807b' : '#edf5f1')
      .attr('font-size', Math.min(18, cellSize * 0.32)).attr('font-weight', (cell) => isFocused(cell) || isFound(cell) ? '700' : '500').text((cell) => cell.value);

    const focus = currentStep && currentStep.row >= 0 && currentStep.row < rows && currentStep.col >= 0 && currentStep.col < cols && currentStep.comparison !== 'not_found'
      ? [{ id: 'search-pointer', row: currentStep.row, col: currentStep.col }]
      : [];
    const pointer = focusLayer.selectAll<SVGGElement, typeof focus[number]>('g.search-pointer').data(focus, (item) => item.id).join(
      (enter) => {
        const group = enter.append('g').attr('class', 'search-pointer');
        group.append('path').attr('d', 'M-7,-13 L7,-13 L0,-4 Z').attr('fill', '#e8b04b');
        group.append('text').attr('text-anchor', 'middle').attr('fill', '#fff0c2').attr('font-size', 10).attr('font-weight', 700).attr('y', -18);
        return group;
      },
      (update) => update,
      (exit) => exit.remove()
    );
    pointer.interrupt('move').transition('move').duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160)
      .attr('transform', (item) => `translate(${item.col * cellSize + cellSize / 2},${item.row * cellSize})`);
    pointer.select('text').text(`(${currentStep?.row ?? 0}, ${currentStep?.col ?? 0})`);

    let overlay = svg.select<SVGGElement>('.canvas-overlay');
    if (overlay.empty()) overlay = svg.append('g').attr('class', 'canvas-overlay').attr('pointer-events', 'none');
    const focusedRow = Math.min(Math.max(currentStep?.row ?? 0, 0), rows - 1);
    const focusedCol = Math.min(Math.max(currentStep?.col ?? 0, 0), cols - 1);
    const focusX = offsetX + (focusedCol + 0.5) * cellSize * transform.scale;
    const focusY = offsetY + (focusedRow + 0.5) * cellSize * transform.scale;
    const calloutWidth = Math.min(300, Math.max(220, width - 32));
    const calloutHeight = 92;
    const calloutX = focusX < width * 0.58
      ? Math.min(width - calloutWidth - 16, focusX + 26)
      : Math.max(16, focusX - calloutWidth - 26);
    const calloutY = Math.min(Math.max(focusY - calloutHeight / 2, 54), height - calloutHeight - 34);
    const value = currentStep?.currentValue ?? matrix[focusedRow]?.[focusedCol];
    const operation = currentStep?.operation;
    const comparison = currentStep?.comparison;
    const decision = operation === 'eliminate_col'
      ? [`${value} > ${target}：比目标大`, `这一列下面只会更大`, `排除第 ${focusedCol + 1} 列，向左 ←`]
      : operation === 'eliminate_row'
        ? [`${value} < ${target}：比目标小`, `这一行左边只会更小`, `排除第 ${focusedRow + 1} 行，向下 ↓`]
        : comparison === 'found'
          ? [`${value} = ${target}：找到目标`, '答案就在当前格', '搜索结束 ✓']
          : comparison === 'not_found'
            ? ['指针已经越界', '每一步都排除了一整行或一整列', `矩阵里没有 ${target} ✓`]
            : [`目标值是 ${target}`, '从右上角开始比较', '大了向左，小了向下'];
    const callout = [{ id: 'decision', x: calloutX, y: calloutY, focusX, focusY, hasFocus: comparison !== 'not_found' }];
    overlay.selectAll<SVGLineElement, typeof callout[number]>('line.decision-connector').data(callout, (item) => item.id).join('line')
      .attr('class', 'decision-connector').attr('x1', (item) => item.hasFocus ? (item.x > item.focusX ? item.x : item.x + calloutWidth) : item.x + calloutWidth / 2)
      .attr('y1', (item) => item.y + calloutHeight / 2).attr('x2', (item) => item.focusX).attr('y2', (item) => item.focusY)
      .attr('stroke', '#e8b04b').attr('stroke-width', 2).attr('stroke-dasharray', '5 4').attr('opacity', (item) => item.hasFocus ? 0.9 : 0);
    const decisionCard = overlay.selectAll<SVGGElement, typeof callout[number]>('g.decision-callout').data(callout, (item) => item.id).join(
      (enter) => {
        const group = enter.append('g').attr('class', 'decision-callout');
        group.append('rect').attr('class', 'decision-bg').attr('rx', 9);
        group.append('text').attr('class', 'decision-title');
        group.selectAll('text.decision-line').data([0, 1, 2]).join('text').attr('class', 'decision-line');
        return group;
      }
    );
    decisionCard.attr('transform', (item) => `translate(${item.x},${item.y})`);
    decisionCard.select('rect').attr('width', calloutWidth).attr('height', calloutHeight).attr('fill', '#14211f').attr('stroke', comparison === 'found' ? '#4f8d7b' : '#e8b04b').attr('stroke-width', 1.5);
    decisionCard.select('text.decision-title').attr('x', 12).attr('y', 20).attr('fill', '#e8b04b').attr('font-size', 11).attr('font-weight', 700).text(`为什么这样走？ · ${operation ?? '准备'}`);
    decisionCard.selectAll<SVGTextElement, number>('text.decision-line').data([0, 1, 2]).attr('x', 12).attr('y', (line) => 42 + line * 16)
      .attr('fill', (line) => line === 2 ? '#9ad3c2' : '#edf5f1').attr('font-size', 11).attr('font-weight', (line) => line === 2 ? 700 : 400).text((line) => decision[line]);
    overlay.selectAll<SVGTextElement, { id: string; text: string }>('text.legend').data([
      { id: 'current', text: '▶ 正在看' }, { id: 'visited', text: '• 看过了' }, { id: 'excluded', text: '× 已排除' }, { id: 'target', text: '◎ 目标值' }
    ], (item) => item.id).join('text').attr('class', 'legend').attr('x', (_, index) => 14 + index * Math.min(100, (width - 28) / 4)).attr('y', height - 15).attr('fill', (item) => item.id === 'target' ? '#9ad3c2' : '#c2d0cb').attr('font-size', Math.min(11, width / 35)).text((item) => item.text);
    overlay.selectAll('text.counter').data([null]).join('text').attr('class', 'counter').attr('x', width - 14).attr('y', 20).attr('text-anchor', 'end').attr('fill', '#9ad3c2').attr('font-size', 12)
      .text(`检查 ${visited.size} 格 | 排除 ${excludedRows.size + excludedCols.size} 行/列`);
  }, [matrix, target, currentStep, transform, rows, cols]);

  useEffect(() => {
    drawMatrix();
    if (!containerRef.current) return;
    const observer = new ResizeObserver(drawMatrix);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [drawMatrix]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;
    const startX = event.clientX - transform.x;
    const startY = event.clientY - transform.y;
    const handleMouseMove = (moveEvent: MouseEvent) => setTransform((previous) => ({ ...previous, x: moveEvent.clientX - startX, y: moveEvent.clientY - startY }));
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [transform.x, transform.y]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setTransform((previous) => ({ ...previous, scale: Math.min(Math.max(previous.scale * delta, 0.5), 2) }));
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.controls}><span className={styles.hint}>箭头指向当前格 · 拖拽移动 · 滚轮缩放</span>
        <button className={styles.resetButton} onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}>重置视图</button>
      </div>
      <svg ref={svgRef} className={styles.svg} aria-label="矩阵搜索过程" onMouseDown={handleMouseDown} onWheel={handleWheel} />
    </div>
  );
}

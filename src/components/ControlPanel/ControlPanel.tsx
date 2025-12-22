import { useEffect, useState, useCallback, useRef } from 'react';
import { getSetting, saveSetting } from '../../utils/storage';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function ControlPanel({
  currentStep,
  totalSteps,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange
}: ControlPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // 加载保存的速度
  useEffect(() => {
    getSetting<number>('playbackSpeed', 1).then(onSpeedChange);
  }, [onSpeedChange]);

  // 保存速度设置
  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
    saveSetting('playbackSpeed', newSpeed);
  }, [onSpeedChange]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentStep > 0) onStepChange(currentStep - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentStep < totalSteps - 1) onStepChange(currentStep + 1);
          break;
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, onStepChange, onPlayPause, onReset]);

  // 进度条拖拽
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const step = Math.round(percent * (totalSteps - 1));
    onStepChange(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps, onStepChange]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  }, [handleProgressClick]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const step = Math.round(percent * (totalSteps - 1));
      onStepChange(Math.max(0, Math.min(step, totalSteps - 1)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, totalSteps, onStepChange]);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const speedOptions = [0.5, 0.75, 1, 1.5, 2];

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ⏮ 上一步 <span className={styles.shortcut}>←</span>
        </button>

        <button className={styles.playButton} onClick={onPlayPause}>
          {isPlaying ? '⏸ 暂停' : '▶ 播放'} <span className={styles.shortcut}>空格</span>
        </button>

        <button
          className={styles.button}
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep === totalSteps - 1}
        >
          下一步 ⏭ <span className={styles.shortcut}>→</span>
        </button>

        <button className={styles.resetButton} onClick={onReset}>
          ↺ 重置 <span className={styles.shortcut}>R</span>
        </button>

        <div className={styles.speedControl}>
          <span className={styles.speedLabel}>速度:</span>
          <div className={styles.speedButtons}>
            {speedOptions.map((s) => (
              <button
                key={s}
                className={`${styles.speedButton} ${speed === s ? styles.active : ''}`}
                onClick={() => handleSpeedChange(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stepInfo}>
          步骤: {currentStep + 1} / {totalSteps}
        </div>
      </div>

      <div
        className={styles.progressContainer}
        ref={progressRef}
        onMouseDown={handleProgressMouseDown}
      >
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
          <div
            className={styles.progressThumb}
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

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

export function ControlPanel({ currentStep, totalSteps, isPlaying, onStepChange, onPlayPause, onReset, speed, onSpeedChange }: ControlPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getSetting<number>('playbackSpeed', 1).then(onSpeedChange); }, [onSpeedChange]);
  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
    saveSetting('playbackSpeed', newSpeed);
  }, [onSpeedChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.getAttribute('role') === 'slider')) return;
      switch (event.key) {
        case 'ArrowLeft': event.preventDefault(); if (currentStep > 0) onStepChange(currentStep - 1); break;
        case 'ArrowRight': event.preventDefault(); if (currentStep < totalSteps - 1) onStepChange(currentStep + 1); break;
        case ' ': event.preventDefault(); onPlayPause(); break;
        case 'r': case 'R': event.preventDefault(); onReset(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, onStepChange, onPlayPause, onReset]);

  const updateProgress = useCallback((clientX: number) => {
    if (!progressRef.current || totalSteps < 1) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onStepChange(Math.round(percent * (totalSteps - 1)));
  }, [totalSteps, onStepChange]);
  const handleProgressMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateProgress(event.clientX);
  }, [updateProgress]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (event: MouseEvent) => updateProgress(event.clientX);
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateProgress]);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const speedOptions = [0.5, 0.75, 1, 1.5, 2];
  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => onStepChange(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>⏮ 上一步</button>
        <button className={styles.playButton} onClick={onPlayPause}>{isPlaying ? '⏸ 暂停' : '▶ 播放'}</button>
        <button className={styles.button} onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))} disabled={currentStep === totalSteps - 1}>下一步 ⏭</button>
        <button className={styles.resetButton} onClick={onReset}>↺ 重置</button>
        <div className={styles.speedControl}>
          <span className={styles.speedLabel}>速度:</span>
          <div className={styles.speedButtons}>{speedOptions.map((value) => <button key={value} className={`${styles.speedButton} ${speed === value ? styles.active : ''}`} onClick={() => handleSpeedChange(value)}>{value}x</button>)}</div>
        </div>
      </div>
      <div className={styles.controlRow}>
        <div className={styles.progressContainer} ref={progressRef} onMouseDown={handleProgressMouseDown} role="slider" aria-label="演示进度" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={currentStep + 1} tabIndex={0} onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onStepChange(Math.max(0, currentStep - 1));
          if (event.key === 'ArrowRight') onStepChange(Math.min(totalSteps - 1, currentStep + 1));
        }}>
          <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${progress}%` }} /><div className={styles.progressThumb} style={{ left: `${progress}%` }} /></div>
        </div>
        <div className={styles.stepInfo}>第 {currentStep + 1} / {totalSteps} 步</div>
      </div>
    </div>
  );
}

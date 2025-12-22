import { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { CodePanel } from './components/CodePanel';
import { Canvas } from './components/Canvas';
import { ControlPanel } from './components/ControlPanel';
import { AlgorithmModal } from './components/AlgorithmModal';
import { WeChatFloat } from './components/WeChatFloat';
import { AlgorithmType, InputData, AlgorithmStep } from './types';
import { generateSteps } from './algorithms';
import { exampleData } from './data/examples';
import styles from './App.module.css';

function App() {
  // 数据状态
  const [matrix, setMatrix] = useState<number[][]>(exampleData[0].matrix);
  const [target, setTarget] = useState<number>(exampleData[0].target);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('z_search');
  
  // 步骤状态
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // 弹窗状态
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  
  // 播放定时器
  const playIntervalRef = useRef<number | null>(null);

  // 生成步骤
  useEffect(() => {
    const newSteps = generateSteps(algorithm, matrix, target);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, matrix, target]);

  // 播放控制
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      playIntervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  // 数据变更处理
  const handleDataChange = useCallback((data: InputData) => {
    setMatrix(data.matrix);
    setTarget(data.target);
  }, []);

  // 算法变更处理
  const handleAlgorithmChange = useCallback((algo: AlgorithmType) => {
    setAlgorithm(algo);
  }, []);

  // 步骤变更处理
  const handleStepChange = useCallback((step: number) => {
    setCurrentStepIndex(step);
  }, []);

  // 播放/暂停
  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentStepIndex, steps.length]);

  // 重置
  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // 速度变更
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className={styles.app}>
      <Header onShowAlgorithmInfo={() => setShowAlgorithmInfo(true)} />
      
      <InputPanel
        onDataChange={handleDataChange}
        currentAlgorithm={algorithm}
        onAlgorithmChange={handleAlgorithmChange}
      />

      <div className={styles.mainContent}>
        <div className={styles.codeSection}>
          <CodePanel algorithm={algorithm} currentStep={currentStep} />
        </div>
        
        <div className={styles.canvasSection}>
          <Canvas matrix={matrix} target={target} currentStep={currentStep} />
        </div>
      </div>

      <ControlPanel
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onStepChange={handleStepChange}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={handleSpeedChange}
      />

      <AlgorithmModal
        algorithm={algorithm}
        isOpen={showAlgorithmInfo}
        onClose={() => setShowAlgorithmInfo(false)}
      />

      <WeChatFloat />
    </div>
  );
}

export default App;

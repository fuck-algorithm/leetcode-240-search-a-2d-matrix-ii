import { AlgorithmType } from '../../types';
import { algorithmInfos } from '../../data/algorithmInfo';
import styles from './AlgorithmModal.module.css';

interface AlgorithmModalProps {
  algorithm: AlgorithmType;
  isOpen: boolean;
  onClose: () => void;
}

export function AlgorithmModal({ algorithm, isOpen, onClose }: AlgorithmModalProps) {
  if (!isOpen) return null;

  const info = algorithmInfos[algorithm];

  // 简单的Markdown渲染
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={styles.list}>
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className={styles.h2}>{line.slice(3)}</h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className={styles.h3}>{line.slice(4)}</h3>
        );
      } else if (line.startsWith('- ')) {
        listItems.push(line.slice(2));
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        // 处理粗体
        const processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p key={index} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: processed }} />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {info.name} ({info.nameEn})
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>时间: {info.timeComplexity}</span>
          <span className={styles.badge}>空间: {info.spaceComplexity}</span>
        </div>
        <div className={styles.content}>
          {renderMarkdown(info.description)}
        </div>
      </div>
    </div>
  );
}

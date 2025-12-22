import { useEffect, useState, useCallback } from 'react';
import { AlgorithmType, CodeLanguage, AlgorithmStep } from '../../types';
import { algorithmCodes } from '../../data/algorithmCode';
import { getSetting, saveSetting } from '../../utils/storage';
import styles from './CodePanel.module.css';

interface CodePanelProps {
  algorithm: AlgorithmType;
  currentStep: AlgorithmStep | null;
}

const languageNames: Record<CodeLanguage, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JavaScript'
};

export function CodePanel({ algorithm, currentStep }: CodePanelProps) {
  const [language, setLanguage] = useState<CodeLanguage>('java');

  useEffect(() => {
    getSetting<string>('codeLanguage', 'java').then((lang) => {
      setLanguage(lang as CodeLanguage);
    });
  }, []);

  const handleLanguageChange = useCallback((lang: CodeLanguage) => {
    setLanguage(lang);
    saveSetting('codeLanguage', lang);
  }, []);

  const code = algorithmCodes[algorithm][language];
  const lines = code.split('\n');
  const highlightedLines = currentStep?.codeLines[language] || [];

  // 获取变量显示
  const getVariableDisplay = (lineIndex: number): string | null => {
    if (!currentStep?.variables) return null;
    
    const lineNum = lineIndex + 1;
    if (!highlightedLines.includes(lineNum)) return null;

    // 根据代码内容匹配变量
    const line = lines[lineIndex];
    const vars = currentStep.variables;
    const displays: string[] = [];

    if (line.includes('x =') || line.includes('x,') || line.includes('x <')) {
      if ('x' in vars) displays.push(`x = ${vars.x}`);
    }
    if (line.includes('y =') || line.includes('y,') || line.includes('y >') || line.includes('y -')) {
      if ('y' in vars) displays.push(`y = ${vars.y}`);
    }
    if (line.includes('matrix[x][y]') || line.includes('matrix[x,y]')) {
      if ('matrix[x][y]' in vars) displays.push(`值 = ${vars['matrix[x][y]']}`);
    }
    if (line.includes('mid')) {
      if ('mid' in vars) displays.push(`mid = ${vars.mid}`);
    }
    if (line.includes('left')) {
      if ('left' in vars) displays.push(`left = ${vars.left}`);
    }
    if (line.includes('right')) {
      if ('right' in vars) displays.push(`right = ${vars.right}`);
    }

    return displays.length > 0 ? displays.join(', ') : null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>代码</span>
        <div className={styles.languageTabs}>
          {(Object.keys(languageNames) as CodeLanguage[]).map((lang) => (
            <button
              key={lang}
              className={`${styles.languageTab} ${language === lang ? styles.active : ''}`}
              onClick={() => handleLanguageChange(lang)}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.codeContainer}>
        <pre className={styles.code}>
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            const varDisplay = getVariableDisplay(index);
            
            return (
              <div
                key={index}
                className={`${styles.line} ${isHighlighted ? styles.highlighted : ''}`}
              >
                <span className={styles.lineNumber}>{lineNum}</span>
                <span className={styles.lineContent}>{line || ' '}</span>
                {varDisplay && (
                  <span className={styles.variableDisplay}>// {varDisplay}</span>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

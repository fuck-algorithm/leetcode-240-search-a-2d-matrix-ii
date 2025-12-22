import { AlgorithmStep, AlgorithmType } from '../types';
import { generateZSearchSteps } from './zSearch';
import { generateBruteForceSteps } from './bruteForce';
import { generateBinarySearchSteps } from './binarySearch';

export function generateSteps(
  algorithm: AlgorithmType,
  matrix: number[][],
  target: number
): AlgorithmStep[] {
  switch (algorithm) {
    case 'z_search':
      return generateZSearchSteps(matrix, target);
    case 'brute_force':
      return generateBruteForceSteps(matrix, target);
    case 'binary_search':
      return generateBinarySearchSteps(matrix, target);
    default:
      return generateZSearchSteps(matrix, target);
  }
}

export { generateZSearchSteps, generateBruteForceSteps, generateBinarySearchSteps };

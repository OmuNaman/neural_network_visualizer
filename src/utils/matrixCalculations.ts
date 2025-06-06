// FILE: src/utils/matrixCalculations.ts

// --- Neural Network Parameters ---
// Architecture: 2 -> 4 -> 4 -> 2

// Sample Input (1x2 matrix)
export const NN_INPUT = [[0.5, -0.2]];

// Layer 1: 2x4
export const NN_W1 = [
  [0.1, 0.4, -0.2, 0.7],
  [0.3, -0.5, 0.6, -0.1]
];
export const NN_B1 = [[0.1, 0.2, 0.1, -0.3]];

// Layer 2: 4x4
export const NN_W2 = [
  [0.4, -0.2, 0.1, 0.5],
  [-0.1, 0.3, -0.5, 0.2],
  [0.7, -0.3, 0.2, -0.1],
  [0.2, 0.6, -0.4, 0.3]
];
export const NN_B2 = [[-0.2, 0.1, 0.3, -0.1]];

// Layer 3 (Output): 4x2
export const NN_W3 = [
  [0.2, -0.1],
  [-0.3, 0.5],
  [0.6, -0.2],
  [-0.1, 0.4]
];
export const NN_B3 = [[0.1, -0.2]];


// --- Math Helpers ---

// Matrix multiplication
export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const resultRows = a.length;
  const resultCols = b[0].length;
  const innerDim = b.length;

  if (a[0].length !== b.length) {
    console.error("Matrix dimensions incompatible for multiplication:", a[0].length, "vs", b.length);
    return Array(resultRows).fill(null).map(() => Array(resultCols).fill(NaN));
  }

  const result = Array(resultRows).fill(null).map(() => Array(resultCols).fill(0));
  
  for (let i = 0; i < resultRows; i++) {
    for (let j = 0; j < resultCols; j++) {
      for (let k = 0; k < innerDim; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

// Element-wise matrix addition
export function matrixAdd(a: number[][], b: number[][]): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) {
    console.error("Matrix dimensions must match for addition.");
    return a;
  }
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}


// Activation Functions
export function relu(matrix: number[][]): number[][] {
  return matrix.map(row => row.map(val => Math.max(0, val)));
}

export function softmax(matrix: number[][]): number[][] {
  return matrix.map(row => {
    const maxVal = Math.max(...row);
    const expRow = row.map(x => Math.exp(x - maxVal));
    const sum = expRow.reduce((acc, val) => acc + val, 0);

    if (sum === 0) return row.map(() => 1 / row.length); // Avoid division by zero, return uniform distribution

    return expRow.map(x => x / sum);
  });
}

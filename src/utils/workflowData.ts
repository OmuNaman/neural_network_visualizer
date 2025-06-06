// FILE: src/utils/workflowData.ts
import type { Node, Edge } from '@xyflow/react';
import { 
  NN_INPUT, NN_W1, NN_B1, NN_W2, NN_B2, NN_W3, NN_B3, 
  matrixMultiply, matrixAdd, relu, softmax 
} from './matrixCalculations';

// --- Pre-calculate all expected results for the forward pass ---
const Z1 = matrixAdd(matrixMultiply(NN_INPUT, NN_W1), NN_B1);
const A1 = relu(Z1);

const Z2 = matrixAdd(matrixMultiply(A1, NN_W2), NN_B2);
const A2 = relu(Z2);

const Z3 = matrixAdd(matrixMultiply(A2, NN_W3), NN_B3);
const A3 = softmax(Z3);

// --- Define Node Positions ---
const col0 = 0, col1 = 550, col2 = 1100, col3 = 1650, col4 = 2200;
const row0 = 0, row1 = 450, row2 = 900;

const LAYER_COLORS = {
  input: { light: '#f3f4f6', dark: 'rgba(55, 65, 81, 0.3)' },
  hidden1: { light: '#eff6ff', dark: 'rgba(59, 130, 246, 0.1)' },
  hidden2: { light: '#f0fdfa', dark: 'rgba(20, 184, 166, 0.1)' },
  output: { light: '#fef2f2', dark: 'rgba(239, 68, 68, 0.1)' },
};

export const initialNodes: Node[] = [
  // --- Layer Backgrounds ---
  //{ id: 'bg-hidden1', type: 'layerBackground', position: { x: col1 - 50, y: row0 - 100 }, data: { label: 'Hidden Layer 1', color: LAYER_COLORS.hidden1 }, style: { width: '1050px', height: '1100px' }, zIndex: -1 },
  //{ id: 'bg-hidden2', type: 'layerBackground', position: { x: col3 - 50, y: row0 - 100 }, data: { label: 'Hidden Layer 2', color: LAYER_COLORS.hidden2 }, style: { width: '1050px', height: '1100px' }, zIndex: -1 },
  
  // --- Input Layer ---
  { id: 'input', type: 'matrix', position: { x: col0, y: row1 }, data: { label: 'Input (A⁰)', matrix: NN_INPUT, description: '1x2 Vector' } },

  // --- Hidden Layer 1 ---
  { id: 'w1', type: 'matrix', position: { x: col1, y: row0 }, data: { label: 'Weights W¹', matrix: NN_W1, description: '2x4 Matrix' } },
  { id: 'b1', type: 'matrix', position: { x: col1, y: row2 }, data: { label: 'Biases b¹', matrix: NN_B1, description: '1x4 Vector' } },
  { id: 'calc-z1', type: 'calculation', position: { x: col2, y: row1 }, data: { 
      label: 'Calculate Z¹', formula: "Z¹ = (A⁰ ⋅ W¹) + b¹", description: "Weighted Sum", 
      expectedMatrix: Z1, hint: 'Matrix multiply Input with W¹, then add bias b¹.' }
  },
  { id: 'activate-a1', type: 'activation', position: { x: col2 + 550, y: row1 }, data: { 
      label: 'Activate A¹', formula: "A¹ = ReLU(Z¹)", description: "ReLU Activation", 
      expectedMatrix: A1 }
  },

  // --- Hidden Layer 2 ---
  { id: 'w2', type: 'matrix', position: { x: col3, y: row0 }, data: { label: 'Weights W²', matrix: NN_W2, description: '4x4 Matrix' } },
  { id: 'b2', type: 'matrix', position: { x: col3, y: row2 }, data: { label: 'Biases b²', matrix: NN_B2, description: '1x4 Vector' } },
  { id: 'calc-z2', type: 'calculation', position: { x: col4, y: row1 }, data: { 
      label: 'Calculate Z²', formula: "Z² = (A¹ ⋅ W²) + b²", description: "Weighted Sum", 
      expectedMatrix: Z2, hint: 'Matrix multiply A¹ with W², then add bias b².' }
  },
  { id: 'activate-a2', type: 'activation', position: { x: col4 + 550, y: row1 }, data: { 
      label: 'Activate A²', formula: "A² = ReLU(Z²)", description: "ReLU Activation", 
      expectedMatrix: A2 }
  },
  
  // --- Output Layer ---
  { id: 'w3', type: 'matrix', position: { x: col4 + 1100, y: row0 }, data: { label: 'Weights W³', matrix: NN_W3, description: '4x2 Matrix' } },
  { id: 'b3', type: 'matrix', position: { x: col4 + 1100, y: row2 }, data: { label: 'Biases b³', matrix: NN_B3, description: '1x2 Vector' } },
  { id: 'calc-z3', type: 'calculation', position: { x: col4 + 1650, y: row1 }, data: { 
      label: 'Calculate Z³', formula: "Z³ = (A² ⋅ W³) + b³", description: "Weighted Sum (Logits)", 
      expectedMatrix: Z3, hint: 'Matrix multiply A² with W³, then add bias b³.' }
  },
  { id: 'activate-a3', type: 'activation', position: { x: col4 + 2200, y: row1 }, data: { 
      label: 'Activate A³', formula: "A³ = Softmax(Z³)", description: "Softmax Activation", 
      expectedMatrix: A3 }
  },
];


export const initialEdges: Edge[] = [
  // To Hidden Layer 1 Calcs
  { id: 'e-input-z1', source: 'input', target: 'calc-z1', animated: true },
  { id: 'e-w1-z1', source: 'w1', target: 'calc-z1', animated: true },
  { id: 'e-b1-z1', source: 'b1', target: 'calc-z1', animated: true },
  { id: 'e-z1-a1', source: 'calc-z1', target: 'activate-a1', animated: true },

  // To Hidden Layer 2 Calcs
  { id: 'e-a1-z2', source: 'activate-a1', target: 'calc-z2', animated: true },
  { id: 'e-w2-z2', source: 'w2', target: 'calc-z2', animated: true },
  { id: 'e-b2-z2', source: 'b2', target: 'calc-z2', animated: true },
  { id: 'e-z2-a2', source: 'calc-z2', target: 'activate-a2', animated: true },

  // To Output Layer Calcs
  { id: 'e-a2-z3', source: 'activate-a2', target: 'calc-z3', animated: true },
  { id: 'e-w3-z3', source: 'w3', target: 'calc-z3', animated: true },
  { id: 'e-b3-z3', source: 'b3', target: 'calc-z3', animated: true },
  { id: 'e-z3-a3', source: 'calc-z3', target: 'activate-a3', animated: true },
];
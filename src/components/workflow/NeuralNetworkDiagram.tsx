// FILE: src/components/workflow/NeuralNetworkDiagram.tsx
import { useTheme } from '@/components/ThemeProvider';
import { motion } from 'framer-motion';

interface NeuralNetworkDiagramProps {
  architecture: number[];
  activeNodeId: string | null;
}

const nodeProgressMap: Record<string, number> = {
  'input': 0,
  'calc-z1': 1,
  'activate-a1': 2,
  'calc-z2': 3,
  'activate-a2': 4,
  'calc-z3': 5,
  'activate-a3': 6,
};

export function NeuralNetworkDiagram({ architecture, activeNodeId }: NeuralNetworkDiagramProps) {
  const { isDark } = useTheme();
  const progress = activeNodeId ? nodeProgressMap[activeNodeId] ?? -1 : -1;

  const width = 800;
  const height = 200;
  const layerSpacing = width / (architecture.length + 1);

  const positions = architecture.map((numNeurons, i) => {
    const layerX = layerSpacing * (i + 1);
    const neuronYSpacing = height / (numNeurons + 1);
    return Array.from({ length: numNeurons }, (_, j) => ({
      x: layerX,
      y: neuronYSpacing * (j + 1),
    }));
  });

  const themeColors = {
    inactive: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(156, 163, 175, 0.4)',
    activeNeuron: isDark ? '#38bdf8' : '#0ea5e9', // Light Blue
    activeConnection: isDark ? '#a78bfa' : '#8b5cf6', // Purple
  };

  return (
    <div className={`w-full h-full p-4 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Connections */}
        {positions.slice(0, -1).map((layer, i) => {
          const isConnectionsActive = (progress === (i * 2) + 1);
          return layer.map((startNode, j) =>
            positions[i + 1].map((endNode, k) => (
              <motion.line
                key={`line-${i}-${j}-${k}`}
                x1={startNode.x} y1={startNode.y}
                x2={endNode.x} y2={endNode.y}
                stroke={isConnectionsActive ? themeColors.activeConnection : themeColors.inactive}
                strokeWidth={isConnectionsActive ? 1.5 : 0.5}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: isConnectionsActive ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
              />
            ))
          );
        })}

        {/* Neurons */}
        {positions.map((layer, i) => {
          const isLayerActive = (progress === (i * 2));
          return layer.map((node, j) => (
            <motion.circle
              key={`node-${i}-${j}`}
              cx={node.x}
              cy={node.y}
              r={isLayerActive ? 8 : 6}
              fill={isLayerActive ? themeColors.activeNeuron : themeColors.inactive}
              stroke={isLayerActive ? themeColors.activeNeuron : 'none'}
              strokeWidth={2}
              initial={{ scale: 1 }}
              animate={{ scale: isLayerActive ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ));
        })}
      </svg>
    </div>
  );
}
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { RotateCcw, MessageSquare } from 'lucide-react';
import { MatrixNode } from '@/components/workflow/MatrixNode';
import { CalculationNode } from '@/components/workflow/CalculationNode';
import { ActivationNode } from '@/components/workflow/ActivationNode'; // New Import
import { LayerBackgroundNode } from '@/components/workflow/LayerBackgroundNode'; // New Import
import { ChatBot } from '@/components/ChatBot';
import { initialNodes as rawInitialNodes, initialEdges } from '@/utils/workflowData';

// Updated node types
const nodeTypes = {
  matrix: MatrixNode,
  calculation: CalculationNode,
  activation: ActivationNode,
  layerBackground: LayerBackgroundNode,
};

function NeuralNetworkWorkflowContent({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: (isDark: boolean) => void }) {
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set());
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleNodeComplete = useCallback((nodeId: string) => {
    setCompletedNodeIds(prev => new Set(prev).add(nodeId));
  }, []);

  // Rewritten dependency logic for the Neural Network
  const processedNodes = useMemo(() => {
    return rawInitialNodes.map(node => {
      let disabled = true; // Default to disabled

      if (node.type === 'calculation' || node.type === 'activation') {
        switch (node.id) {
          case 'calc-z1':
            disabled = false; // First step is always enabled
            break;
          case 'activate-a1':
            disabled = !completedNodeIds.has('calc-z1');
            break;
          case 'calc-z2':
            disabled = !completedNodeIds.has('activate-a1');
            break;
          case 'activate-a2':
            disabled = !completedNodeIds.has('calc-z2');
            break;
          case 'calc-z3':
            disabled = !completedNodeIds.has('activate-a2');
            break;
          case 'activate-a3':
            disabled = !completedNodeIds.has('calc-z3');
            break;
          default:
            disabled = true;
        }

        return {
          ...node,
          data: {
            ...node.data,
            onComplete: handleNodeComplete,
            disabled: disabled,
          },
        };
      }
      return node;
    });
  }, [completedNodeIds, handleNodeComplete]);

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const resetWorkflow = () => {
    setNodes(rawInitialNodes);
    setEdges(initialEdges);
    setCompletedNodeIds(new Set());
  };
  
  useEffect(() => {
    setNodes(processedNodes);
  }, [processedNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={`h-screen w-full transition-colors duration-300 relative overflow-hidden ${
       isDark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-4 mx-4 z-50 flex items-center justify-between backdrop-blur-md shadow-lg rounded-lg p-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-slate-300/60'
      }`}>
        <div className="flex items-center gap-4">
          <img 
            src="/image.png" 
            alt="Vizuara AI Labs" 
            className="h-8"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Interactive Neural Network (2-4-4-2)
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 transition-colors duration-150 ${
              isDark 
                ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100' 
                : 'text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {isChatOpen ? 'Close Chat' : 'Open Chat'}
          </Button>
          <Button
            onClick={resetWorkflow}
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 transition-colors duration-150 ${
              isDark 
                ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100' 
                : 'text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      <div className="h-full pt-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="workflow-canvas"
        >
          <Background 
            gap={24}
            size={1.5}
            color={isDark ? '#334155' : '#cbd5e1'}
          />
          <MiniMap 
             nodeColor={(node: Node) => {
                switch (node.type) {
                    case 'matrix': return isDark ? '#3b82f6' : '#2563eb';
                    case 'calculation': return isDark ? '#a855f7' : '#9333ea';
                    case 'activation': return isDark ? '#f59e0b' : '#d97706';
                    default: return isDark ? '#6b7280' : '#4b5563';
                }
            }}
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '0.375rem'
            }}
            maskColor={isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(226, 232, 240, 0.7)'}
          />
          <Controls />
        </ReactFlow>

        <ChatBot isOpen={isChatOpen} />
      </div>
    </div>
  );
}

export function SelfAttentionWorkflow() { // Keeping function name to avoid breaking imports
  const [isDark, setIsDark] = useState(true);

  const handleThemeToggle = (newIsDark: boolean) => {
    setIsDark(newIsDark);
  };

  return (
    <ThemeProvider isDark={isDark}>
      <NeuralNetworkWorkflowContent isDark={isDark} onToggleTheme={handleThemeToggle} />
    </ThemeProvider>
  );
}
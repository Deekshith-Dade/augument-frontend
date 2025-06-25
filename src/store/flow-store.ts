import { create } from "zustand";
import { Node, Edge } from "reactflow";

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  setFlow: (nodes: Node[], edges: Edge[]) => void;
  clearFlow: () => void;

  currentNodeId: string;
  currentNodeData: Node | null;
  setCurrentNodeId: (nodeId: string) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  setFlow: (nodes, edges) => set({ nodes, edges }),
  clearFlow: () => set({ nodes: [], edges: [] }),

  currentNodeData: null,
  currentNodeId: "",
  setCurrentNodeId: (nodeId) => set((state) => ({
    currentNodeId: nodeId,
    currentNodeData: state.nodes.find((node) => node.id === nodeId),
  })),
}));
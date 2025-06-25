import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  // MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Connection,
  EdgeTypes,
  OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomNode, CustomEdge } from "./custom/nodes-edges";
import { useFlowStore } from "@/store/flow-store";
import { NodeDisplay } from "./custom/node-display";

const nodeTypes = {
  self_reflection_theme: CustomNode,
  self_reflection_emotion: CustomNode,
  self_reflection_goal: CustomNode,
};

const edgeTypes = {
  self_reflection_theme: CustomEdge,
  self_reflection_emotion: CustomEdge,
  self_reflection_goal: CustomEdge,
  self_reflection_connector: CustomEdge,
};

const ThoughtEvolutionFlow = () => {
  const { nodes: inNodes, edges: inEdges, currentNodeId } = useFlowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(inNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(inEdges);

  // Update nodes and edges when props change
  useEffect(() => {
    setNodes(inNodes);
  }, [inNodes, setNodes]);

  useEffect(() => {
    setEdges(inEdges);
  }, [inEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const proOptions = { hideAttribution: true };

  return (
    <div className="w-[95vw] h-[calc(100vh-200px)] bg-gray-50 mx-auto">
      {/* <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Thought Evolution
        </h1>
        <p className="text-sm text-gray-600">
          Interactive visualization of cognitive development
        </p>
      </div> */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls
          className="bg-white border border-gray-300 rounded-lg shadow-lg"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        {/* <MiniMap
          className="bg-white border border-gray-300 rounded-lg shadow-lg"
          nodeColor={(node) => (node.selected ? "#1f2937" : "#d1d5db")}
          maskColor="rgba(0, 0, 0, 0.1)"
        /> */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
      </ReactFlow>

      <style jsx>{`
        .line-clamp-8 {
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {currentNodeId && <NodeDisplay />}
    </div>
  );
};

export default ThoughtEvolutionFlow;

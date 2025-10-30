// components/TreeVisualizer.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Controls,
  ReactFlowInstance,
  OnNodesChange,
  OnEdgesChange,
  type ColorMode,
} from '@xyflow/react';
import 'reactflow/dist/style.css';
import SearchBar from './SearchBar';
import DownloadButton from './DownloadButton';

import "@xyflow/react/dist/style.css";


type AnyJSON = Record<string, any> | any[] | string | number | boolean | null;


function jsonToFlow(json: AnyJSON) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Simple layout counters to give y spacing
  const columnX = (depth: number) => depth * 280;
  let nextY = 0;
  const getNextY = () => {
    const y = nextY;
    nextY += 80;
    return y;
  };

  function visit(value: AnyJSON, path: string, depth: number, label?: string, parentPath?: string) {
    // Determine node type and set appropriate styling
    let nodeStyle = {};
    let display = '';

    if (value === null || value === undefined) {
      display = `${label ?? path}: ${String(value)}`;
      nodeStyle = { backgroundColor: '#f3f4f6', borderColor: '#6b7280' }; // Gray for null/undefined
    } else if (Array.isArray(value)) {
      display = `${label ?? path} (array)`;
      nodeStyle = { backgroundColor: '#d1fae5', borderColor: '#10b981' }; // Green for arrays
    } else if (typeof value === 'object') {
      display = `${label ?? path} (object)`;
      nodeStyle = { backgroundColor: '#dbeafe', borderColor: '#3b82f6' }; // Blue for objects
    } else if (typeof value === 'string') {
      display = `${label ?? path}: ${String(value)} (string)`;
      nodeStyle = { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }; // Orange for primitives
    } else if (typeof value === 'number') {
      display = `${label ?? path}: ${String(value)} (number)`;
      nodeStyle = { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }; // Orange for primitives
    } else if (typeof value === 'boolean') {
      display = `${label ?? path}: ${String(value)} (boolean)`;
      nodeStyle = { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }; // Orange for primitives
    } else {
      display = `${label ?? path}: ${String(value)}`;
      nodeStyle = { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }; // Orange for primitives
    }

    // If node already exists with the same id, skip creating duplicate nodes
    if (!nodes.find((n) => n.id === path)) {
      nodes.push({
        id: path,
        position: { x: depth * 280, y: getNextY() },
        data: { label: display, raw: value },
        style: {
          ...nodeStyle,
          padding: 10,
          borderRadius: 8,
          color: '#111',
          width: 250,
          borderWidth: 2,
          fontSize: 12,
          transition: 'all 0.2s ease',
        },
      });
    }

    if (parentPath) {
      edges.push({
        id: `e-${parentPath}--${path}`,
        source: parentPath,
        target: path,
        animated: false,
      });
    }

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          const childPath = `${path}[${idx}]`;
          visit(item, childPath, depth + 1, `${label ?? path}[${idx}]`, path);
        });
      } else {
        Object.entries(value).forEach(([k, v]) => {
          const childPath = path === '$' ? `$.${k}` : `${path}.${k}`;
          visit(v, childPath, depth + 1, k, path);
        });
      }
    }
  }

  visit(json, '$', 0);

  return { nodes, edges };
}

interface TreeVisualizerProps {
  json: AnyJSON | null;
  onSearch?: (query: string) => void;
  darkMode?: boolean;
}

export default function TreeVisualizer({ json, onSearch, darkMode }: TreeVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  console.log(nodes, edges, json);

  // build nodes/edges when json changes
  useEffect(() => {
    if (!json) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: nds, edges: eds } = jsonToFlow(json);
    setNodes(nds);
    setEdges(eds);
    // reset selection
    setSelectedPath(null);
  }, [json, setNodes, setEdges]);

  // On init, save React Flow instance
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    rfInstanceRef.current = instance;
  }, []);

  // search: find node id by path, highlight it and center on it
  const searchAndPan = useCallback(
    (pathQuery: string) => {
      // If onSearch is provided, let the parent component handle the search
      if (onSearch) {
        onSearch(pathQuery);
        return;
      }

      // Original search implementation
      if (!pathQuery || nodes.length === 0) {
        alert('No nodes to search');
        return;
      }

      // Normalize
      let needle = pathQuery.trim();
      if (!needle.startsWith('$')) {
        // allow "user.address.city" or ".user.address"
        needle = '$' + (needle.startsWith('.') ? '' : '.') + needle;
      }

      const match = nodes.find((n) => n.id === needle);
      if (!match) {
        alert('No match found');
        return;
      }

      // highlight node (temporary style & ensure previous highlights removed)
      setNodes((nds) =>
        nds.map((n) =>
          n.id === match.id
            ? { ...n, style: { ...(n.style || {}), boxShadow: '0 0 14px 3px rgba(255,0,0,0.6)', border: '2px solid rgba(255,0,0,0.8)' } }
            : { ...n, style: { ...(n.style || {}), boxShadow: undefined, border: undefined } }
        )
      );

      const inst = rfInstanceRef.current;
      if (inst && typeof (inst as any).setCenter === 'function') {
        try {
          inst.setCenter(match.position.x, match.position.y, { duration: 400 });
        } catch {
          try {
            // @ts-ignore
            inst.panTo?.({ x: match.position.x, y: match.position.y });
          } catch {
            const nodeElement = document.querySelector(`[data-id="${match.id}"]`);
            nodeElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          }
        }
      } else {
        const nodeElement = document.querySelector(`[data-id="${match.id}"]`);
        nodeElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    },
    [nodes, setNodes]
  );

  return (
    <div className={`h-120 ${darkMode ? 'dark-bgcolor' : 'light-bgcolor'}`}>
      <div className="flex gap-2">
        <SearchBar onSearch={searchAndPan} />
        <button
          className="btn px-2 py-1 shadow-md rounded cursor-pointer "
          onClick={() => {
            // Use instance to reset view if available
            const inst = rfInstanceRef.current;
            if (inst && typeof (inst as any).fitView === 'function') {
              try {
                // @ts-ignore
                inst.fitView({ padding: 0.2, duration: 400 });
                return;
              } catch { }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
           Fit View
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={handleInit}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange as OnEdgesChange}
        fitView
        colorMode={darkMode ? 'dark' : 'light'}
        color='#111'
      >
        <Background />
        <Controls />
        < DownloadButton />
      </ReactFlow>

      {/* {hoveredNode.node && (
        <div 
          className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3 max-w-xs pointer-events-none"
          // style={tooltipStyle}
        >
          <div className="text-sm font-mono">
            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Path:</div>
            <div className="text-gray-900 dark:text-white break-all">
              {hoveredNode.node.data.path}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-2 mb-1">Value:</div>
            <div className="text-gray-900 dark:text-white break-all">
              {typeof hoveredNode.node.data.raw === 'object' 
                ? JSON.stringify(hoveredNode.node.data.raw, null, 2)
                : String(hoveredNode.node.data.raw)}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

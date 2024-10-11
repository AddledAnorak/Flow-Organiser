import { Panel, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";


type AddNodeButtonProps = {
  nodes: any,
  setNodes: any,
  h: number,
  w: number
}

export default function AddNodeButton({
  nodes, setNodes, h, w
}: AddNodeButtonProps) {
  const { getViewport, getZoom } = useReactFlow(); // Get viewport and zoom info

  const addNode = useCallback(() => {
    const { x, y } = getViewport();  // Get current viewport position
    const zoom = getZoom();          // Get current zoom level

    // Calculate the position for the new node based on viewport and zoom level
    const newX = (-x)/zoom + (w/zoom) / 2;
    const newY = (-y)/zoom + (h/zoom) / 2;

    const newNode = {
      id: `${nodes.length + 1}`,
      type: "content-editable",
      position: { x: newX, y: newY },
      data: { label: `Node ${nodes.length + 1}` },
      measured: { width: 100, height: 100 },
    };

    setNodes((nds: any) => [...nds, newNode] as any);
  }, [nodes, setNodes, getViewport, getZoom]);


  return (
    <Panel position="top-right">
        <button onClick={addNode} className='text-white hover:bg-[#2c2c2c] rounded-lg mx-2 bg-transparent p-2'>
        Add Node
        </button>
    </Panel>
  );
}
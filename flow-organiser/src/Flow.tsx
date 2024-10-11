import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Edge,
  type Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

import FlowInSidebar from './FlowInSidebar';
import AddNodeButton from './AddNodeButton';
import CreateNewFlowButton from './NewFlowButton';
import useAuth from './useAuth';


export default function Flow() {
  const { token, tokenLoading } = useAuth();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowList, setFlowList] = useState([]);
  const [flowName, setFlowName] = useState('');

  const [flowLoading, setFlowLoading] = useState<boolean>(true);
  const [flowListLoading, setFlowListLoading] = useState<boolean>(true);

  const flowPlaneDivRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams() as any;


  useEffect(() => {
    const initialize = async () => {
      // get all flow data
      const response = await fetch('http://localhost:8000/flowlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFlowList(data);
      setFlowListLoading(false);

      // set flow name
      setFlowName(data.find((flow: any) => flow.id === id)?.name);
    }
     
    const setThisFlowData = async () => {
      // get flow data
      const response2 = await fetch('http://localhost:8000/state/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data2 = await response2.json();
      setNodes(data2.nodes);
      setEdges(data2.edges);
      setFlowLoading(false);
    };


    console.log(token, tokenLoading);

    if(!tokenLoading && !token) {
      navigate('/login');
    }

    initialize();
    setThisFlowData();
  }, [tokenLoading, token, navigate]);


  useEffect(() => {
    const setFlowState = async () => {
      await fetch('http://localhost:8000/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: flowName, 
          id: id, 
          nodes: nodes, 
          edges: edges
        }),
      });
    };


    if(!flowLoading && flowName != '') {
      setFlowState();
    }
  }, [nodes, edges]);


  const addEdgeCustom = (connection: Connection, edges: Edge[]) => {
    if(edges.find((edge: Edge) => edge.id === `${connection.source}->${connection.target}`)) {
      return edges;
    }

    const conn = {...connection, id: `${connection.source}->${connection.target}`};
    return [...edges, conn];
  }

  const onConnect: OnConnect = useCallback((connection) => {
    console.log(connection);
    return setEdges((oldEdges: any) => {
      console.log(oldEdges);
      const newEdges = addEdgeCustom(connection, oldEdges);
      console.log(newEdges);
      return newEdges as any;      
    });
  }, [setEdges]);


  if(flowListLoading) {
    return (
      <div className='w-full h-full text-center flex justify-center items-center bg-[#141414] text-white'>
        Loading Your Flows...
      </div>
    );
  }

  return (<ReactFlowProvider>
    <div className='flex h-full w-full'>
      <div className='flex flex-col bg-[#1e1e1e] h-full w-80 pt-4'>
        

        <div className='flex justify-center mb-8'>
          <CreateNewFlowButton access_token={token}></CreateNewFlowButton>
        </div>


        <div className='w-full flex-grow overflow-y-auto pt-2'>

          {flowList && flowList.length > 0 && flowList.map((flow: any) => (
            <FlowInSidebar access_token={token} name={flow.name} key={flow.id} id={flow.id} renameCallback={setFlowName} />
          ))}
        </div>

      </div>

      <div className='h-full w-full' ref={flowPlaneDivRef}>

        { flowLoading? 
          <div className='bg-[#141414] text-white text-center flex justify-center items-center h-full'>
            Loading...
          </div> : 
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            colorMode='dark'
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
            <Panel position='top-center'>
              <div className='text-white text-center text-lg bg-[#1e1e1e] py-2 px-8 rounded-sm'>
                {flowName}
              </div>
            </Panel>
            <AddNodeButton 
              nodes={nodes} 
              setNodes={setNodes} 
              h={flowPlaneDivRef.current?.clientHeight as number}
              w={flowPlaneDivRef.current?.clientWidth as number}
            ></AddNodeButton>
          </ReactFlow>
        }


      </div>

    </div>
  </ReactFlowProvider>);
}


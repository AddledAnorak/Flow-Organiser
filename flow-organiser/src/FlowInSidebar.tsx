import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function FlowInSidebar({ access_token, name, key, id, renameCallback }: any) {
  const [currentName, setCurrentName] = useState(name);
  const { id: activeFlowId } = useParams() as any;
  const flowInSidebarRef = useRef<HTMLDivElement | null>(null); 

  const renameFlow = () => {
    const newName = prompt('Enter a new name for the flow');
    if(newName) {
      setCurrentName(newName);
      renameCallback(newName);
      fetch('http://localhost:8000/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ 
          name: newName, 
          id: id, 
        }),
      });
    }
  }


  const deleteFlow = () => {
    if(confirm('Are you sure you want to delete this flow?')) {
      fetch('http://localhost:8000/' + id, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if(activeFlowId === id)
        window.location.href = '/';
      else if(flowInSidebarRef.current)
        flowInSidebarRef.current.style.display = 'none';
    }
  }


  return (<>
    <div ref={flowInSidebarRef} className="group flex items-center justify-between block hover:bg-[#2c2c2c] rounded-lg mx-2 bg-transparent text-white p-2 mb-1">
      <a href={`/flow/${id}`}>{currentName}</a>


      <div className="flex justify-end">


        <button onClick={renameFlow} className='group-hover:block flex justify-end hidden px-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6ebf2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-edit">
            <path d="M11 21H21"></path>
            <path d="M16.5 3.5A2.121 2.121 0 0 1 19 6L9 16l-4 1 1-4 10-10a2.121 2.121 0 0 1 3 0z"></path>
          </svg>
        </button>


        <button onClick={deleteFlow} className='group-hover:block flex justify-end hidden'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6ebf2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <rect x="5" y="6" width="14" height="14" rx="2" ry="2" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>

      </div>


      
    </div>
  </>);
};
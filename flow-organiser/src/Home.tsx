import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import CreateNewFlowButton from "./NewFlowButton";
import useAuth from "./useAuth";

export default function Home() {
  const { token, tokenLoading } = useAuth();
  const navigate = useNavigate();

  if(!tokenLoading && !token) {
    navigate('/login');
  }

  const [loading, setLoading] = useState(false);
  const [flowList, setFlowList] = useState([]);


  useEffect(() => {
    console.log(token, tokenLoading);
    if(!tokenLoading && !token) {
      navigate('/login');
    }
  }, [tokenLoading, navigate]);

  useEffect(() => {
    const getAllFlows = async () => {
      const response = await fetch('http://localhost:8000/flowlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setFlowList(data);
      setLoading(false);
    };


    console.log(token);

    if(!tokenLoading && !token) {
      navigate('/login');
    }

    getAllFlows();
  }, [token]);

  if(loading) {
    return (
      <div className='w-full h-full text-center flex justify-center items-center bg-[#141414] text-white'>
        Loading Your Flows...
      </div>
    );
  }


  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-[#141414]">
      <h1 className="text-5xl mt-24 mb-8">Choose Your Flow</h1>

      <div className="w-1/4">
        <CreateNewFlowButton access_token={token}></CreateNewFlowButton>
      </div>

      <div className='flex-col items-center w-full h-full'>
        {flowList && flowList.length > 0 && flowList.map((flow: any) => (
          <div key={flow.id} className='rounded-lg w-3/4 text-center border-2 border-[#3c3c3c] p-4 m-4 '>
            <a href={`/flow/${flow.id}`} className='text-xl'>{flow.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
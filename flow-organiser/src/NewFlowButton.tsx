export default function CreateNewFlowButton({ access_token }: any) {

  const createNewFlow = async () => {
    const response = await fetch('http://localhost:8000/newflow', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    window.location.href = `/flow/${data}`;
  };

  return (
    <button onClick={createNewFlow} className='text-white border-2 border-[#3c3c3c] p-4 mx-4 rounded-lg w-full'>
      Create New Flow
    </button>
  );
};
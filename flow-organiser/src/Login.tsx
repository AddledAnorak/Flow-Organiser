export default function Login() {

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    
    const username = (document.querySelector('input[type="text"]') as HTMLInputElement)?.value;
    const password = (document.querySelector('input[type="password"]') as HTMLInputElement)?.value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('http://localhost:8000/token', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/';
      })
      .catch(error => {
        console.log(error);
      });


  };


  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white">

      <div className="bg-[#141414] p-8 rounded-lg border-2 border-[#3c3c3c] ">


        <div className="text-5xl mb-8">Login</div>

        <div className="text-lg mb-2">Enter Username: </div>
        <input className="border-2 border-[#3c3c3c] rounded-lg outline-none p-2 bg-transparent mb-4" type="text" placeholder="Username" />

        <div className="text-lg mb-2">Enter Password: </div>
        <input className="border-2 border-[#3c3c3c] rounded-lg outline-none p-2 bg-transparent mb-4" type="password" placeholder="Password" />


        <button onClick={handleSubmit} className="text-2xl block border-2 border-white p-4 rounded-lg mt-4">Submit</button>

      </div>

    </div>
  );
}
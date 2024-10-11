import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Flow from './Flow';
import Login from './Login';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/flow/:id" element={<Flow />} />
    </Routes>
  );
}

export default App;

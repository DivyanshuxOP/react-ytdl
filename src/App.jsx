import './index.css'
import Navbar from './navbar.jsx'
import Box from './box.jsx'
import Downloadpage from './downloadpage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {


  return (
    <Router>
    <Navbar />
    <Routes>
    <Route path="/" element={<Box/>} />
    <Route path="/download" element={<Downloadpage />} />
    </Routes>
</Router>
  )
}

export default App
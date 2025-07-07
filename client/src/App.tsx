import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Signup from './pages/Signup'
import WhiteBoard from './components/canvas/WhiteBoard'

function App() {

  return (
    <BrowserRouter>
    <Routes>
    
    <Route path='/' element={<Home />}  />
    <Route path='/signin' element={<Signin />}  />
    <Route path='/signup' element={<Signup />}  />
    <Route path='/wb' element={<WhiteBoard />}  />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

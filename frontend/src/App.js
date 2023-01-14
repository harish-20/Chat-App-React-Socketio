import { Routes, Route } from 'react-router-dom'

import Header from './components/Header/Header'
import Chat from './pages/Chat/Chat'
import Login from './pages/Login/Login'

import './App.css'

function App() {
  return (
    <>
      <Header />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat/:user/:room" element={<Chat />} />
        </Routes>
      </div>
    </>
  )
}

export default App

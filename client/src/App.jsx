import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookDetails from './pages/BookDetails'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Reader from './pages/Reader'

const App = () => {
  return (
   <BrowserRouter>
<div className="min-h-screen bg-gradient-to-br from-[#0a2a1a] via-[#0a0a0a] to-[#061206]">

   <Routes>
    <Route path="/read/:id" element={<Reader />} />
          <Route path="/*" element={
            <>
   <Navbar/>
<Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/book/:id" element={<BookDetails/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/admin" element={<AdminPanel/>}/>
</Routes>
    </>
          }/>
   </Routes>
   
   </div>
   </BrowserRouter>
  )
}

export default App
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
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import Landing from './pages/Landing'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#0a2a1a] via-[#0a0a0a] to-[#061206] flex flex-col">
        <Routes>

          {/* Reader pe Navbar + Footer nahi */}
          <Route path="/read/:id" element={<Reader />} />

          {/* Baaki sab pe Navbar + Footer hai */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          } />

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
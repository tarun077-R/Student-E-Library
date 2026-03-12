import axios from 'axios'

const API = axios.create({
    baseURL: 'https://student-e-library.onrender.com/api',
    withCredentials: true
})

// Auth
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const logout = () => API.post('/auth/logout')
export const getMe = () => API.get('/auth/me')

// Books
export const getAllBooks = (params) => API.get('/books', { params })
export const getBookById = (id) => API.get(`/books/${id}`)
export const addBook = (data) => API.post('/books', data,  { headers: {
        'Content-Type': 'multipart/form-data'
    }})
export const updateBook = (id, data) => API.put(`/books/${id}`, data)
export const deleteBook = (id) => API.delete(`/books/${id}`)

// Shelf
export const saveBook = (bookId) => API.post(`/users/save/${bookId}`)
export const getShelf = () => API.get('/users/shelf')
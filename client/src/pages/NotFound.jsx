import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#1a1d2e] flex flex-col items-center justify-center text-white">
            <p className="text-8xl font-black text-white/5 mb-4">404</p>
            <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
            <p className="text-white/30 text-sm mb-8">Yeh page exist nahi karta!</p>
            <button
                onClick={() => navigate('/')}
                className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-all cursor-pointer border-none"
            >
                Back to Home
            </button>
        </div>
    )
}

export default NotFound
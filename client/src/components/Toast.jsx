import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl transition-all animate-pulse-once
            ${type === 'success'
                ? 'bg-[#13151f] border-green-500/20 text-green-400'
                : 'bg-[#13151f] border-red-500/20 text-red-400'
            }`}>
            <span>{type === 'success' ? '✓' : '✕'}</span>
            <p className="text-sm font-semibold">{message}</p>
            <button
                onClick={onClose}
                className="text-white/20 hover:text-white transition-all bg-transparent border-none cursor-pointer ml-2"
            >
                ✕
            </button>
        </div>
    )
}

export default Toast
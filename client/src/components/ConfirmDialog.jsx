const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-[#13151f] border border-white/10 rounded-2xl px-8 py-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
                    🗑️
                </div>
                <div className="text-center">
                    <h3 className="text-white font-bold text-sm">Are you sure?</h3>
                    <p className="text-white/30 text-xs mt-1">{message}</p>
                </div>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 text-sm py-2.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 text-sm py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
const Footer = () => {
    return (
        <footer className="bg-[#13151f] border-t border-white/5 px-4 md:px-10 py-8 md:py-10 mt-auto">
            <div className="max-w-7xl mx-auto">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">

                    {/* Logo + Description */}
                    <div>
                        <span className="text-white font-black text-lg tracking-tight">
                            HOME<span className="text-white/30">LIBRARY</span>
                        </span>
                        <p className="text-white/20 text-xs mt-2 max-w-xs leading-relaxed">
                            A free digital library for students. Browse, read and save books to your personal shelf.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-10 md:gap-12">
                        <div>
                            <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-3">
                                Library
                            </p>
                            <div className="flex flex-col gap-2">
                                <a href="/home" className="text-white/30 text-xs hover:text-white transition-all no-underline">Browse Books</a>
                                <a href="/dashboard" className="text-white/30 text-xs hover:text-white transition-all no-underline">My Shelf</a>
                                <a href="/register" className="text-white/30 text-xs hover:text-white transition-all no-underline">Register</a>
                            </div>
                        </div>
                        <div>
                            <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-3">
                                Tech Stack
                            </p>
                            <div className="flex flex-col gap-2">
                                <span className="text-white/30 text-xs">React + Vite</span>
                                <span className="text-white/30 text-xs">Node + Express</span>
                                <span className="text-white/30 text-xs">MongoDB Atlas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-white/20 text-xs text-center sm:text-left">
                        © 2026 Student E-Library. Made with ❤️ by Tarun Rawat
                    </p>
                    <p className="text-white/20 text-xs">
                        Built with MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
import React from 'react';

const Home = () => {
    return (
        <div className="bg-white text-gray-900 font-sans">


            {/* --- HERO SECTION --- */}
            <header className="relative bg-[#232536] text-white py-20 px-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 max-w-2xl">
                    <p className="uppercase tracking-widest text-sm mb-4">Posted on <span className="font-bold">Startup</span></p>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Step-by-step guide to choosing great font pairs</h1>
                    <p className="text-gray-300 mb-8">By James West | May 23, 2022</p>
                    <button className="bg-yellow-400 text-black px-8 py-3 font-bold hover:bg-yellow-500">Read More {">"}</button>
                </div>
            </header>

            {/* --- FEATURED & ALL POSTS --- */}
            <section className="py-16 px-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-8">Featured Post</h2>
                    <div className="border p-6">
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" alt="Building" className="w-full h-64 object-cover mb-6" />
                        <p className="text-sm text-gray-500 mb-2">By John Doe | May 23, 2022</p>
                        <h3 className="text-2xl font-bold mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</h3>
                        <p className="text-gray-600 mb-6">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <button className="bg-yellow-400 text-black px-8 py-3 font-bold">Read More {">"}</button>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">All Posts</h2>
                        <a href="#" className="text-purple-600 hover:underline">View All</a>
                    </div>
                    <div className="space-y-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="hover:bg-yellow-50 p-4 transition">
                                <p className="text-sm text-amber-600 mb-2">By John Doe | Aug 23, 2021</p>
                                <h4 className="font-bold text-lg leading-snug">8 Figma design systems that you can download for free today.</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CATEGORIES --- */}
            <section className="py-16 px-10 text-center">
                <h2 className="text-3xl font-bold mb-10">Choose A Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Business', 'Startup', 'Economy', 'Technology'].map((cat, idx) => (
                        <div key={idx} className={`border p-8 text-left hover:bg-yellow-400 transition cursor-pointer group ${cat === 'Startup' ? 'bg-yellow-400' : ''}`}>
                            <div className="bg-yellow-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center group-hover:bg-white">🏢</div>
                            <h3 className="font-bold text-xl mb-2">{cat}</h3>
                            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default Home; // Esto arregla tu error de "default export"
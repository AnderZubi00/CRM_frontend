import React from 'react';

const SobreNosotros = () => {
    return (
        <div className="bg-white text-[#232536] font-sans">

            {/* --- SECCIÓN 1: CABECERA (ABOUT US) --- */}
            <section className="relative px-6 md:px-20 py-20 flex flex-col md:flex-row items-center gap-0">
                <div className="bg-white p-12 md:w-3/5 z-10 shadow-sm">
                    <p className="uppercase tracking-[3px] text-sm mb-4 font-medium">ABOUT US</p>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        We are a team of content writers who share their learnings
                    </h1>
                </div>
                <div className="md:w-2/5 text-gray-600 text-sm leading-relaxed p-6">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </section>

            {/* --- SECCIÓN 2: IMAGEN CON ESTADÍSTICAS --- */}
            <section className="px-6 md:px-20 relative">
                <div className="relative h-[400px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                        alt="Team working"
                        className="w-full h-full object-cover"
                    />
                    {/* Bloque de estadísticas (Amarillo y Morado) */}
                    <div className="absolute bottom-0 left-0 md:left-12 flex">
                        <div className="bg-yellow-400 p-8 md:p-12 text-black">
                            <h2 className="text-4xl font-bold">12+</h2>
                            <p className="text-sm">Blogs Published</p>
                        </div>
                        <div className="bg-yellow-400 p-8 md:p-12 text-black border-l border-yellow-500">
                            <h2 className="text-4xl font-bold">18K+</h2>
                            <p className="text-sm">Views on Finsweet</p>
                        </div>
                        <div className="bg-yellow-400 p-8 md:p-12 text-black border-l border-yellow-500">
                            <h2 className="text-4xl font-bold">30K+</h2>
                            <p className="text-sm">Total active Users</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-purple-600 md:w-[600px]"></div>
                </div>
            </section>

            {/* --- SECCIÓN 3: MISIÓN Y VISIÓN --- */}
            <section className="bg-[#F4F0F8] px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <p className="uppercase tracking-widest font-bold text-sm mb-4">OUR MISION</p>
                    <h3 className="text-2xl font-bold mb-4">Creating valuable content for creatives all around the world</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At risus viverra adipiscing at in tellus.
                    </p>
                </div>
                <div>
                    <p className="uppercase tracking-widest font-bold text-sm mb-4">OUR VISION</p>
                    <h3 className="text-2xl font-bold mb-4">A platform that empowers individuals to improve</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At risus viverra adipiscing at in tellus.
                    </p>
                </div>
            </section>

            {/* --- SECCIÓN 4: TEAM OF CREATIVES (Diseño invertido) --- */}
            <section className="px-6 md:px-20 py-24 flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-6">Our team of creatives</h2>
                    <h4 className="text-xl font-bold mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</h4>
                    <p className="text-gray-600 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
                <div className="md:w-1/2 relative">
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-tl-[50px]"></div>
                    <img
                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
                        alt="Hands together"
                        className="w-full h-[400px] object-cover rounded-sm"
                    />
                </div>
            </section>

            {/* --- SECCIÓN 5: WHY WE STARTED THIS BLOG --- */}
            <section className="px-6 md:px-20 py-24 flex flex-col-reverse md:flex-row items-center gap-16">
                <div className="md:w-1/2 relative">
                    <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2048&auto=format&fit=crop"
                        alt="People sitting"
                        className="w-full h-[400px] object-cover rounded-sm"
                    />
                    <div className="absolute -bottom-6 left-12 w-16 h-16 bg-purple-600 rounded-full"></div>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-6">Why we started this Blog</h2>
                    <h4 className="text-xl font-bold mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</h4>
                    <p className="text-gray-600 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </section>

        </div>
    );
};

export default SobreNosotros; 
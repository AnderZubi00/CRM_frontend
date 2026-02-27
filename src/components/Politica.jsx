import React from 'react';

const Politica = () => {
    return (
        <div className="w-full font-sans">
            {/* Header Section - Light Background */}
            <header className="bg-[#F4F0F8] py-20 px-5 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-[#232536] mb-4">
                    Privacy Policy
                </h1>
            </header>

            {/* Content Section - Dark Background */}
            <main className="bg-white text-white py-24 px-5">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* First Block */}
                    <section>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#232536]">
                            Lorem ipsum dolor sit amet
                        </h2>
                        <div className="space-y-6 text-black leading-relaxed text-lg">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At
                                risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes.
                                Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas diam.
                            </p>
                        </div>
                    </section>

                    {/* Second Block */}
                    <section>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#232536] leading-tight">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                        </h2>
                        <div className="space-y-6 text-[#232536] leading-relaxed text-lg">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At
                                risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes.
                                Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas diam. Risus in
                                hendrerit gravida rutrum quisque non.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At
                                risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes.
                            </p>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}

export default Politica;

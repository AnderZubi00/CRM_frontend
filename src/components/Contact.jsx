import React from 'react';

const Contact = () => {
    return (
        <div className="bg-white font-sans text-[#232536]">
            {/* Header Section */}
            <section className="text-center py-16 px-5 max-w-3xl mx-auto">
                <h5 className="tracking-[2px] font-bold mb-3 uppercase text-sm">Contact Us</h5>
                <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                    Let’s Start a Conversation
                </h1>
                <p className="text-[#6d6e76] leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.
                </p>
            </section>

            {/* Purple Info Bar */}
            <section className="bg-[#592ea9] text-white flex flex-col md:flex-row justify-around py-12 px-[10%] gap-8">
                <div className="flex-1">
                    <span className="block text-sm opacity-80 mb-4 pb-2 border-b border-white/20 w-4/5">
                        Working hours
                    </span>
                    <h3 className="text-xl font-bold">Monday To Friday</h3>
                    <h3 className="text-xl font-bold">9:00 AM to 8:00 PM</h3>
                    <p className="opacity-80">Our Support Team is available 24/7</p>
                </div>

                <div className="flex-1">
                    <span className="block text-sm opacity-80 mb-4 pb-2 border-b border-white/20 w-4/5">
                        Contact Us
                    </span>
                    <h3 className="text-xl font-bold text-2xl">020 7993 2905</h3>
                    <p className="opacity-80 text-lg">hello@finsweet.com</p>
                </div>
            </section>

            {/* Form Section */}
            <section className="max-w-3xl mx-auto my-12 px-5">
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-5 border border-[#d1d1d1] rounded-sm text-base focus:border-[#592ea9] outline-none"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full p-5 border border-[#d1d1d1] rounded-sm text-base focus:border-[#592ea9] outline-none"
                        required
                    />
                    <select
                        className="w-full p-5 border border-[#d1d1d1] rounded-sm text-base focus:border-[#592ea9] outline-none bg-white"
                        defaultValue=""
                    >
                        <option value="" disabled>Query Related</option>
                        <option value="support">Support</option>
                        <option value="sales">Sales</option>
                    </select>
                    <textarea
                        placeholder="Message"
                        rows="5"
                        className="w-full p-5 border border-[#d1d1d1] rounded-sm text-base focus:border-[#592ea9] outline-none resize-none"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-[#ffd050] text-[#232536] border-none p-5 text-xl font-bold cursor-pointer hover:bg-[#f0c040] transition-colors mt-2"
                    >
                        Send Message
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Contact;
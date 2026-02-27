import React from 'react';
import { Button } from "@/components/ui/button";
const Footer = ({ onNavigate }) => {
    return (
        <footer className="bg-[#1D1E2D] text-white py-16 px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                <div className="text-2xl font-bold">{"{Finsweet"}</div>
                <div className="flex space-x-6">
                    <a href="#politica-privacidad" onClick={() => onNavigate?.('politica-privacidad')}>Politicas de privacidad</a>
                </div>
            </div>

            <div className="bg-[#2f3144] p-12 rounded-sm flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
                <h2 className="text-3xl font-bold leading-tight max-w-lg">Subscribe to our newsletter to get latest updates and news</h2>
                <div className="flex w-full lg:w-auto gap-4">
                    <input type="email" placeholder="Enter Your Email" className="bg-transparent border border-gray-600 px-5 py-3 w-full lg:w-80" />
                    <button className="bg-yellow-400 text-black px-8 py-3 font-bold hover:bg-yellow-500 whitespace-nowrap">Subscribe</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
                <p>Fincstreet 118 2561 Fintown | Hello@finsweet.com | 020 7993 2905</p>
                <div className="flex space-x-5 text-lg">
                    {/* Aquí puedes usar iconos reales si tienes instalada la librería (como react-icons) */}
                    <a href="#" className="hover:text-white">f</a>
                    <a href="#" className="hover:text-white">t</a>
                    <a href="#" className="hover:text-white">i</a>
                    <a href="#" className="hover:text-white">l</a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
'use client';

import { useState } from 'react';

export default function Page() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="pb-20 px-4 sm:px-6 pt-0 bg-linear-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="mx-auto max-w-4xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:col-span-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                            <h1 className="text-sm sm:text-lg font-bold leading-tight text-center sm:text-left text-[#1A1A1A]">
                                Contact<br />Us
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[#1A1A1A] font-semibold text-base mb-3">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl border border-black/5 px-4 text-[#1A1A1A] bg-white focus:outline-none transition-colors"
                                    style={{ borderColor: '#0000000D' }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#0000000D'}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[#1A1A1A] font-semibold text-base mb-3">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl border border-black/5 px-4 text-[#1A1A1A] bg-white focus:outline-none transition-colors"
                                    style={{ borderColor: '#0000000D' }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#0000000D'}
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-[#1A1A1A] font-semibold text-base mb-3">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full rounded-xl border border-black/5 px-4 py-3 text-[#1A1A1A] bg-white focus:outline-none transition-colors resize-none"
                                    style={{ borderColor: '#0000000D' }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#0000000D'}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    className="h-12 px-10 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white font-bold transition-colors"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Contact Info & Social */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:col-span-1">
                        <div className="space-y-8">
                            {/* Contact Info */}
                            <div>
                                <h3 className="text-sm sm:text-lg font-bold text-[#1A1A1A] mb-4">Contact</h3>
                                <a
                                    href="mailto:hello@handmadecrafts.com"
                                    className="text-[#64748B] hover:text-[#ef5c5c] transition text-base"
                                >
                                    hello@handmadecrafts.com
                                </a>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-sm sm:text-lg font-bold text-[#1A1A1A] mb-4">Based in</h3>
                                <p className="text-[#64748B] text-base">
                                    Kathmandu,<br />
                                    Nepal
                                </p>
                            </div>

                            {/* Social Media */}
                            <div>
                                <div className="flex gap-4">
                                    {/* Facebook */}
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#ef5c5c] transition"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>

                                    {/* Instagram */}
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#ef5c5c] transition"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2m0 1.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9-4.038-9-9-9m3.5 3a1 1 0 100 2 1 1 0 000-2m-7 5a3.5 3.5 0 110 7 3.5 3.5 0 010-7m0 1a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                                        </svg>
                                    </a>

                                    {/* Twitter */}
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#ef5c5c] transition"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 11.4 2c-.5-.1-1-.2-1.5-.2h-.5a6.965 6.965 0 015.5-2.5c0 8.993-6.786 19.39-19.654 19.39-3.9 0-7.577-.923-10.73-2.564.52.04 1.04.06 1.56.06 3.28 0 6.3-1.12 8.7-3 2.4 2 4.6 2.3 6.8 2.1-1 3-4 5-7.3 5-1.5 0-2.9-.4-4.1-1.1 1.8 1.1 4 1.8 6.4 1.8 7.7 0 13.9-6.3 13.9-14v-.6c1-1 1.9-2 2.6-3.1z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

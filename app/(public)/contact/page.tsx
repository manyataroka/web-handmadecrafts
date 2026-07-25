'use client';

import { useState } from 'react';

export default function Page() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white/70 to-[#FCEEEE] pb-20">
            <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-black mb-2">Contact Us</h1>
                <p className="text-black/70 text-sm">We'd love to hear from you! Send us a message.</p>
            </div>
            <div className="px-6 mt-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    {submitted ? (
                        <div className="text-center py-8">
                            <h3 className="text-lg font-bold text-[#4CAF50] mb-2">Thank you!</h3>
                            <p className="text-black/70 text-sm">Your message has been sent. We'll get back to you soon!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black/80 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-black/80 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-2 w-full bg-[#E53935] text-white font-semibold py-3 rounded-lg hover:bg-[#d32f2f] transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

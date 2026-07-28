'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        try {
            const v = sessionStorage.getItem('isLoggedIn');
            setIsLoggedIn(!!v);
        } catch (e) {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className="pb-20 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <section className="px-6 pt-0 pb-14 min-h-[calc(100vh-4rem)] flex items-center">
                <div className="mx-auto max-w-7xl w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] max-w-lg mx-auto">
                                <Image
                                    src="/images/img13.jpg"
                                    alt="Handcrafted Jewelry"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#ef5c5c] leading-tight tracking-tight mb-6">
                                DISCOVER<br />
                                HANDMADE<br />
                                BEAUTY.
                            </h1>

                            <h2 className="text-xl sm:text-2xl font-bold text-black mb-5">
                                Welcome to Handmade Crafts: where Timeless Elegance Begins!
                            </h2>

                            <p className="text-black/70 text-base sm:text-lg leading-relaxed mb-5">
                                Step into a world of artistry and charm at Handmade Crafts, your trusted destination for
                                exquisite handcrafted jewelry. Every piece is crafted with love and the finest materials.
                                Whether you&apos;re accessorizing for a sunny day, celebrating a special occasion, or just
                                treating yourself, we&apos;ve got something to make your style shine.
                            </p>

                            <p className="text-black/70 text-base sm:text-lg leading-relaxed mb-8">
                                Enjoy our cozy shop, friendly service, and a rotating collection of seasonal designs,
                                statement necklaces, delicate bracelets, and more. Come in, pick your favorite, and make
                                today a little more beautiful!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {!isLoggedIn && (
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="h-[55px] px-8 inline-flex items-center justify-center rounded-full border-2 border-[#E53935] text-[#E53935] text-lg font-bold hover:bg-[#E53935]/5 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

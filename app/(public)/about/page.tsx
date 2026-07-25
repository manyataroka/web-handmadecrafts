export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white/70 to-[#FCEEEE] pb-20">
            <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-black mb-2">About Us</h1>
                <p className="text-black/70 text-sm">Learn more about our handmade jewelry and mission</p>
            </div>
            <div className="px-6 mt-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-black mb-4">Our Story</h2>
                    <p className="text-black/70 text-sm leading-relaxed mb-4">
                        Welcome to our handmade jewelry store! We are passionate about creating beautiful, unique pieces 
                        that are made with love and care. Each item is handcrafted by skilled artisans who pour their 
                        heart into every design.
                    </p>
                    <h2 className="text-xl font-bold text-black mb-4">Our Mission</h2>
                    <p className="text-black/70 text-sm leading-relaxed mb-4">
                        Our mission is to bring you stunning, high-quality handmade jewelry while supporting local artisans 
                        and keeping traditional craft techniques alive. We believe in the beauty of handmade items and the 
                        story behind each piece.
                    </p>
                    <h2 className="text-xl font-bold text-black mb-4">Why Choose Us?</h2>
                    <ul className="list-disc list-inside text-black/70 text-sm leading-relaxed space-y-2">
                        <li>100% Handmade Products</li>
                        <li>Unique Designs</li>
                        <li>High-Quality Materials</li>
                        <li>Support Local Artisans</li>
                        <li>Fast and Secure Shipping</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

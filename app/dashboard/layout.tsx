import Header from "../(public)/_components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <Header />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </section>
    );
}

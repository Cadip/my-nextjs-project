'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <Link
                href="/"
                style={{
                    marginRight: "1rem",
                    fontWeight: isActive("/") ? "bold" : "normal",
                    textDecoration: isActive("/") ? "underline" : "none",
                }}
            >
                Home
            </Link>

            <Link
                href="/favorites"
                style={{
                    fontWeight: isActive("/favorites") ? "bold" : "normal",
                    textDecoration: isActive("/favorites") ? "underline" : "none",
                }}
            >
                Favorites
            </Link>
        </nav>
    );
};

export default Navbar;

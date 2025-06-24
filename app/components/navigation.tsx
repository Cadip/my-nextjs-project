'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user.email) {
                setUserEmail(session.user.email);
            } else {
                setUserEmail(null);
            }

        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    return (
        <nav
            style={{
                padding: "1rem",
                borderBottom: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div>
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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {userEmail && (
                    <span style={{ fontSize: '0.9rem' }}>
                       {userEmail.split('@')[0]}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Navbar from "../components/navigation";
import '../styles.css';
import Link from 'next/link';
import RatingInput from '../components/ratings';
import Delete from '../components/deleteButton';
import useRequireAuth from '../action/authSession'

interface Favorite {
    movies_id: string;
    title: string;
    image_path?: string;
    genres: string[];
}

export default function FavoritesPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const { loading: authLoading } = useRequireAuth();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/login');
            } else {
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const userId = session?.user.id;
            if (!userId) return;

            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error("Error fetching favorites:", error);
            } else {
                setFavorites(data);
            }
            setLoading(false);
        };

        if (!checkingAuth) {
            fetchFavorites();
        }
    }, [checkingAuth]);


    if (checkingAuth) return <p>Loading auth...</p>;

    if (authLoading) {
        return <p>Loading authentication...</p>;
    }
    
    return (
        <>
            <Navbar />
            <main className='container'>
                <h1 className='title'>Daftar Favorit</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : favorites.length === 0 ? (
                    <p>Belum ada anime favorit.</p>
                ) : (
                    <div className='favorites-grid'>
                        {favorites.map((anime) => (
                            <div className='favorite-card' key={anime.movies_id} >
                                <Link href={`/details/${anime.movies_id}`}>
                                    {anime.image_path && (
                                        <img
                                            src={anime.image_path}
                                            alt={anime.title}
                                            className='favorite-img'
                                        />
                                    )}
                                    <h3>{anime.title}</h3>
                                    <p className='genres'>{anime.genres.join(', ')}</p>
                                </Link>
                                <RatingInput movieId={anime.movies_id} />
                                <Delete movies_id={anime.movies_id} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}

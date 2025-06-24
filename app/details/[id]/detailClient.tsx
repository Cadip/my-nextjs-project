'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/navigation';
import AddFavoriteButton from '../../components/addFavoritesButton';

interface Anime {
    id: number;
    title: string;
    synopsis: string;
    url: string;
    imageUrl?: string;
    episodes: number | null;
    score: number | null;
    genres: string[];
    startDate: string | null;
    endDate: string | null;
}

export default function DetailClient({ anime }: { anime: Anime }) {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

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

    if (checkingAuth) return <p>Loading auth...</p>;

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1 className='title'>{anime.title}</h1>
                {anime.imageUrl && (
                    <img src={anime.imageUrl} alt={anime.title} width={250} height={350} />
                )}
                <p><strong>Score:</strong> {anime.score ?? 'N/A'}</p>
                <p><strong>Episodes:</strong> {anime.episodes ?? 'Unknown'}</p>
                <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
                <p><strong>Aired:</strong> {anime.startDate?.slice(0, 10) ?? '?'} – {anime.endDate?.slice(0, 10) ?? '?'}</p>
                <p><strong>Synopsis:</strong> {anime.synopsis}</p>
                <AddFavoriteButton
                    id={anime.id.toString()}
                    title={anime.title}
                    imageUrl={anime.imageUrl}
                    genres={anime.genres}
                />
            </main>
        </>
    );
}

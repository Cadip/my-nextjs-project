'use client';

import '../../styles.css';
import Navbar from "../../components/navigation";
import AddFavoriteButton from '../../components/addFavoritesButton';
import useRequireAuth from '@/app/action/authSession';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

export default function DetailPage() {
    const { loading } = useRequireAuth();
    const [anime, setAnime] = useState<Anime | null>(null);
    const params = useParams();
    const animeId = params?.id;

    useEffect(() => {
        const getAnimeById = async () => {
            if (!animeId) return;

            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                const item = data.data;

                const animeData: Anime = {
                    id: item.mal_id,
                    title: item.title,
                    synopsis: item.synopsis,
                    url: item.url,
                    imageUrl: item.images?.jpg?.image_url,
                    episodes: item.episodes,
                    score: item.score,
                    genres: item.genres.map((g: any) => g.name),
                    startDate: item.aired?.from,
                    endDate: item.aired?.to,
                };

                setAnime(animeData);
            } catch (error) {
                console.error(error);
                setAnime(null);
            }
        };

        if (!loading && animeId) {
            getAnimeById();
        }
    }, [loading, animeId]);

    if (loading) return <div>Loading...</div>;
    if (!anime) return <div>Anime not found or error fetching data.</div>;

    return (
        <>
            <Navbar />
            <main className="container">
                <h1 className="title">{anime.title}</h1>
                {anime.imageUrl && (
                    <img
                        src={anime.imageUrl}
                        alt={anime.title}
                        width={250}
                        height={350}
                    />
                )}
                <p><strong>Score:</strong> {anime.score ?? "N/A"}</p>
                <p><strong>Episodes:</strong> {anime.episodes ?? "Unknown"}</p>
                <p><strong>Genres:</strong> {anime.genres.join(", ")}</p>
                <p><strong>Aired:</strong> {anime.startDate?.slice(0, 10) ?? "?"} – {anime.endDate?.slice(0, 10) ?? "?"}</p>
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

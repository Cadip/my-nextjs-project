'use client';

import '../../styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DetailClient from './detailClient';

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
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };

        if (animeId) getAnimeById();
    }, [animeId]);

    if (loading) return <div>Loading...</div>;
    if (!anime) return <div>Anime not found or error fetching data.</div>;

    return <DetailClient anime={anime} />;
}

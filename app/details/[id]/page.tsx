import '../../styles.css';
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

interface Props {
    params: {
        id: string;
    };
}

async function getAnimeById(id: string): Promise<Anime | null> {
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const item = data.data;

        return {
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
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function DetailPage({ params }: Props) {
    const anime = await getAnimeById(params.id);

    if (!anime) {
        return <div>Anime not found or error fetching data.</div>;
    }

    return <DetailClient anime={anime} />;
}

"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";
import Head from "next/head";
import "./styles.css";
import Navbar from "./components/navigation";
import Link from 'next/link';

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

export default function HomePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<Anime[]>([]);

  const sendPrompt = async () => {
    try {
      const query = prompt.trim();
      if (!query) {
        alert("Please enter a search keyword.");
        return;
      }
      const res = await fetch(`/api/movies?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const animes = data.data.map((item: any) => ({
        id: item.mal_id,
        title: item.title,
        synopsis: item.synopsis,
        url: item.url,
        imageUrl: item.images?.jpg?.image_url,
        episodes: item.episodes,
        score: item.score,
        genres: item.genres.map((g: any) => g.name),
        startDate: item.start_date,
        endDate: item.end_date,
      }));

      setResponse(animes);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendPrompt();
    }
  };

  return (
    <>
      <Navbar />
      <Head>
        <title>Anime Search</title>
        <meta name="description" content="Search anime" />
      </Head>

      <main className="container">
        <h1 className="title">Anime Search</h1>
        <div className="searchBox">
          <input
            value={prompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search anime..."
            type="text"
          />
          <button onClick={sendPrompt}>Search</button>
        </div>

        <div className="results">
          <strong>Results:</strong>
          <div className="grid">
            {response.map((anime, index) => (
              <div key={`${anime.id}-${index}`} className="card">
                {anime.imageUrl && (
                  <img src={anime.imageUrl} alt={anime.title} />
                )}
                <h3 className="title">{anime.title}</h3>
                <p>
                  <strong>Episodes:</strong>{" "}
                  {anime.episodes !== null ? anime.episodes : "Unknown"}
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  {anime.score !== null ? anime.score : "N/A"}
                </p>
                <p>
                  <strong>Genres:</strong> {anime.genres.join(", ")}
                </p>
                <Link href={`/details/${anime.id}`}>
                  More Info
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search") || "";

    if (!query) {
        return NextResponse.json({ data: [] });
    }

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    const res = await fetch(url);

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data);
}

'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles.css';

interface AddFavoriteButtonProps {
    id: string;
    title: string;
    imageUrl?: string;
    genres: string[];
}

export default function AddFavoriteButton({ id, title, imageUrl, genres }: AddFavoriteButtonProps) {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleAddFavorite = async () => {
        const { data: existing, error: selectError } = await supabase
            .from('favorites')
            .select('*')
            .eq('title', title)
            .single();

        if (existing) {
            setMessage('Anime sudah masuk dalam Favorites');
            setIsError(true);
            return;
        }

        const { error: insertError } = await supabase
            .from('favorites')
            .insert([{
                movies_id: id,
                title,
                image_path: imageUrl,
                genres,
            }]);

        if (insertError) {
            console.error('Insert error:', insertError);
            setMessage('Gagal menambahkan Anime ke Favorites.');
            setIsError(true);
        } else {
            setMessage('Berhasil menambahkan Anime ke Favorites!');
            setIsError(false);
        }
    };

    return (
        <>
            <button className='btn' onClick={handleAddFavorite}>Add to Favorites</button>
            {message && (
                <p className={`message ${isError ? 'message-error' : 'message-success'}`}>
                    {message}
                </p>
            )}
        </>
    );
}

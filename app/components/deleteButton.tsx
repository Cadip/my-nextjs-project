'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles.css';

interface DeleteProps {
    movies_id: string;
}

export default function Delete({ movies_id }: DeleteProps) {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleDeleteFavorite = async () => {
        const { data: favorite } = await supabase
            .from('favorites')
            .select('*')
            .eq('movies_id', movies_id)
            .single();

        if (favorite) {
            const { error: favoriteDeleteError } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favorite.id);

            if (favoriteDeleteError) {
                console.error('Delete favorites error:', favoriteDeleteError);
                setMessage('Gagal menghapus dari Favorites.');
                setIsError(true);
                return;
            }
        }

        const { data: rating } = await supabase
            .from('ratings')
            .select('*')
            .eq('movies_id', movies_id)
            .single();

        if (rating) {
            const { error: ratingDeleteError } = await supabase
                .from('ratings')
                .delete()
                .eq('id', rating.id);

            if (ratingDeleteError) {
                console.error('Delete ratings error:', ratingDeleteError);
                setMessage('Favorites dihapus, tapi gagal hapus rating.');
                setIsError(true);
                return;
            }
        }
        setMessage('Berhasil menghapus dari Favorites dan Ratings!');
        setIsError(false);
        window.location.reload();
    }

    return (
        <>
            <button className='btn' onClick={handleDeleteFavorite}>Delete Favorites</button>
            {message && (
                <p className={`message ${isError ? 'message-error' : 'message-success'}`}>
                    {message}
                </p>
            )}
        </>
    );
}
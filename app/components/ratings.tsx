'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface RatingInputProps {
    movieId: string;
}

export default function RatingInput({ movieId }: RatingInputProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasRating, setHasRating] = useState(false);

    const fetchRating = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ratings')
                .select('rating')
                .eq('movies_id', movieId)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setRating(data.rating);
                setHasRating(true);
                setMessage('');
                setIsError(false);
            } else {
                setRating(null);
                setHasRating(false);
            }
        } catch (error) {
            console.error('Gagal memuat rating:', error);
            setMessage('Gagal memuat rating.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRating();
    }, [movieId]);

    const handleSubmitRating = async () => {
        if (rating === null || rating < 1 || rating > 10) {
            setMessage('Rating antara 1 sampai 10');
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            const { data: existingRating, error: fetchError } = await supabase
                .from('ratings')
                .select('*')
                .eq('movies_id', movieId)
                .limit(1)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingRating) {
                const { error: updateError } = await supabase
                    .from('ratings')
                    .update({ rating })
                    .eq('movies_id', movieId);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('ratings')
                    .insert([{ movies_id: movieId, rating }]);

                if (insertError) throw insertError;
            }

            setMessage('Rating berhasil disimpan!');
            setIsError(false);
            setHasRating(true);
        } catch (error) {
            setMessage('Gagal menyimpan rating.');
            setIsError(true);
            console.error(error);
        } finally {
            setLoading(false);
            fetchRating();
        }
    };

    return (
        <div>
            {!hasRating && (
                <>
                    <label>
                        Beri Rating (1-10):
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={rating ?? ''}
                            onChange={(e) => setRating(Number(e.target.value))}
                            style={{ width: '50px', marginLeft: '8px' }}
                            disabled={loading}
                        />
                    </label>
                    <button onClick={handleSubmitRating} style={{ marginLeft: '10px' }} disabled={loading}>
                        Submit
                    </button>
                </>
            )}

            {message && (
                <p style={{ color: isError ? 'red' : 'green', marginTop: '8px' }}>
                    {message}
                </p>
            )}

            {!loading && rating !== null && !isError && (
                <p style={{ marginTop: '8px' }}>
                    Rating Anda: <strong>{rating}</strong>
                </p>
            )}
        </div>
    );
}

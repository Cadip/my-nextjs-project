'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

export default function useRequireAuth() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.replace('/login')
            } else {
                setSession(data.session)
            }
            setLoading(false)
        }

        getSession()
    }, [router])

    return { session, loading }
}

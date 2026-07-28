"use client";

import { useEffect } from "react";
import { setAuthToken } from "../../lib/api/axios-instance";

export default function AuthInit() {
    useEffect(() => {
        try {
            const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
            if (token) {
                setAuthToken(token);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('AuthInit error', err);
        }
    }, []);

    return null;
}

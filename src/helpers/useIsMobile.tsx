import { useState, useEffect } from 'react';

export function useIsMobile(query: string = '(max-width: 768px)'): boolean {
    const [isMobile, setIsMobile] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleResize = () => setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [query]);

    return isMobile;
}
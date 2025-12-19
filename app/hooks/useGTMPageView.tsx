import React, { useEffect } from 'react'
import { useLocation } from 'react-router';

declare global {
    interface Window {
        dataLayer: any[];
    }
}


export default function useGTMPageView() {
    const location = useLocation();

    useEffect(() => {
        const page_path = location.pathname + location.search;
        const page_location = window.location.href;
        const page_title = document.title;

        (window.dataLayer = window.dataLayer || []).push({
            event: "page_view",      
            page_path,
            page_location,
            page_title,
        });
    }, [location.pathname, location.search]);

    return null

}
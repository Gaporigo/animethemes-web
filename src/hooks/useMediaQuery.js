import { useEffect, useState } from "react";

export default function useMediaQuery(query, initialIsMatching = false) {
    const [ isMatching, setIsMatching ] = useState(initialIsMatching);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        setIsMatching(mediaQuery.matches);

        const onChange = (event) => setIsMatching(event.matches);

        mediaQuery.addEventListener("change", onChange);

        return () => mediaQuery.removeEventListener("change", onChange);
    }, [ query ]);

    return isMatching;
}

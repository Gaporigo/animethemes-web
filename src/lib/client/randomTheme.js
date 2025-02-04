import { CLIENT_API_URL } from "utils/config";

const backLog = [];

export async function fetchRandomTheme() {
    if (!backLog.length) {
        const res = await fetch(`${CLIENT_API_URL}/animetheme?sort=random&include=anime,animethemeentries.videos&filter[has]=animethemeentries&filter[spoiler]=false`);
        const json = await res.json();

        backLog.push(...json.animethemes.map((theme) => {
            // Remove all entries which have spoilers (the filter parameter guarantees at least one spoiler-free entry)
            while (theme.animethemeentries[0].spoiler) {
                theme.animethemeentries.shift();
            }

            return {
                ...theme,
                entries: theme.animethemeentries
            };
        }));
    }

    return backLog.pop();
}

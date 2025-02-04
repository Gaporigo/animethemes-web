import { AnimeSummaryCard } from "components/card";
import { Text } from "components/text";
import { Column } from "components/box";
import { fetchData } from "lib/server";
import { SEO } from "components/seo";
import gql from "graphql-tag";
import fetchStaticPaths from "utils/fetchStaticPaths";
import getSharedPageProps from "utils/getSharedPageProps";

const seasonOrder = [ "Winter", "Spring", "Summer", "Fall" ];

export default function SeasonDetailPage({ animeAll, year, season }) {
    const animeList = animeAll
        .filter((anime) => anime.name)
        .sort((a, b) => a.name.localeCompare(b.name));
    const seasonCapitalized = season[0].toUpperCase() + season.slice(1);

    return (
        <>
            <SEO title={`${seasonCapitalized} ${year}`}/>
            <Text variant="h2">
                {`Anime from ${season} of ${year}`}
                <Text color="text-disabled"> ({animeList.length})</Text>
            </Text>
            <Column style={{ "--gap": "16px" }}>
                {animeList.map((anime) => (
                    <AnimeSummaryCard key={anime.slug} anime={anime} expandable/>
                ))}
            </Column>
        </>
    );
}

export async function getStaticProps({ params: { year, season } }) {
    year = +year;

    const { data, apiRequests } = await fetchData(gql`
        ${AnimeSummaryCard.fragments.anime}
        ${AnimeSummaryCard.fragments.expandable}

        query($year: Int = 0, $season: String!) {
            yearAll {
                value
            }
            seasonAll(year: $year) {
                value
            }
            season(year: $year, value: $season) {
                anime {
                    slug
                    ...AnimeSummaryCard_anime
                    ...AnimeSummaryCard_anime_expandable
                }
            }
            
        }
    `, {
        year,
        season
    });

    if (!data?.season) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            ...getSharedPageProps(apiRequests),
            animeAll: data.season.anime,
            year,
            season,
            yearList: data.yearAll
                .map((year) => year.value)
                .sort((a, b) => a - b),
            seasonList: data.seasonAll
                .map((season) => season.value)
                .sort((a, b) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b))
        },
        // Revalidate after 3 hours (= 10800 seconds).
        revalidate: 10800
    };
}

export async function getStaticPaths() {
    return fetchStaticPaths(async () => {
        const { data } = await fetchData(gql`
            query {
                yearAll {
                    value
                    seasons {
                        value
                    }
                }
            }
        `);

        return data.yearAll.flatMap(
            (year) => year.seasons.map((season) => ({
                params: {
                    year: String(year.value),
                    season: season.value
                }
            }))
        );
    });
}

import React from "react";
import Link from "next/link";
import { fetchData } from "lib/server";
import { Text } from "components/text";
import { AlphabeticalIndex } from "components/index";
import getSharedPageProps from "utils/getSharedPageProps";

export default function SeriesIndexPage({ seriesAll }) {
    return (
        <>
            <Text variant="h1">Series Index</Text>
            <AlphabeticalIndex items={seriesAll}>
                {(series) => (
                    <Link key={series.slug} href={`/series/${series.slug}`} passHref prefetch={false}>
                        <Text as="a" block link>{series.name}</Text>
                    </Link>
                )}
            </AlphabeticalIndex>
        </>
    );
}

export async function getStaticProps() {
    const { data, apiRequests } = await fetchData(`
        #graphql

        query {
            seriesAll {
                slug
                name
            }
        }
    `);

    return {
        props: {
            ...getSharedPageProps(apiRequests),
            seriesAll: data.seriesAll
        },
        // Revalidate after 3 hours (= 10800 seconds).
        revalidate: 10800
    };
}

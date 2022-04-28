import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "styles/global";
import theme from "theme";
import { Column } from "components/box";
import { Container } from "components/container";
import { Footer } from "components/footer";
import { Navigation, SearchNavigation, SeasonNavigation, YearNavigation } from "components/navigation";
import ColorThemeContext from "context/colorThemeContext";
import useColorTheme from "hooks/useColorTheme";
import { VideoPlayer } from "components/video-player";
import PlayerContext from "context/playerContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import withBasePath from "utils/withBasePath";
import { SEO } from "components/seo";
import { config } from "@fortawesome/fontawesome-svg-core";
import { WatchHistoryProvider } from "context/watchHistoryContext";
import { LocalPlaylistProvider } from "context/localPlaylistContext";
import { ToastProvider } from "context/toastContext";
import { AnnouncementToast, ToastHub } from "components/toast";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "styles/prism.scss";
import { Text } from "components/text";
import { useRouter } from "next/router";
import useSetting from "hooks/useSetting";
import { devModeSetting } from "utils/settings";

config.autoAddCss = false;

const queryClient = new QueryClient();

const StyledWrapper = styled(Column)`
    min-height: 100%;
`;

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    
    margin-bottom: 32px;
    gap: 24px;
`;

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [colorTheme, toggleColorTheme] = useColorTheme();
    const [devModeSettingValue] = useSetting(devModeSetting);

    const { lastBuildAt, isVideoPage = false, ...videoPageProps } = pageProps;
    const [ lastVideoPageProps, setLastVideoPageProps ] = useState(() => {
        return isVideoPage ? videoPageProps : null;
    });

    if (isVideoPage && lastVideoPageProps?.video?.basename !== videoPageProps?.video?.basename) {
        setLastVideoPageProps(videoPageProps);
    }

    async function revalidate() {
        const secret = prompt("Enter the secret token:");

        const res = await fetch(`${router.basePath}/api/revalidate?secret=${secret}&id=${router.asPath}`);
        if (!res.ok) {
            throw new Error();
        }

        const json = await res.json();
        if (!json.revalidated) {
            throw new Error();
        }

        return json;
    }

    return (
        <MultiContextProvider providers={[
            [ ThemeProvider, { theme } ],
            [ ColorThemeContext.Provider, { value: { colorTheme, toggleColorTheme } } ],
            [ PlayerContext.Provider, { value: {
                currentVideo: lastVideoPageProps?.video,
                clearCurrentVideo: () => setLastVideoPageProps(null)
            } } ],
            [ QueryClientProvider, { client: queryClient } ],
            [ WatchHistoryProvider ],
            [ LocalPlaylistProvider ],
            [ ToastProvider, { initialToasts: [ {
                id: "announcement",
                content: <AnnouncementToast/>
            } ] } ]
        ]}>
            <GlobalStyle/>
            <SEO/>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href={withBasePath("/apple-touch-icon.png")}/>
                <link rel="icon" type="image/png" sizes="32x32" href={withBasePath("/favicon-32x32.png")}/>
                <link rel="icon" type="image/png" sizes="16x16" href={withBasePath("/favicon-16x16.png")}/>
                <link rel="mask-icon" href={withBasePath("/safari-pinned-tab.svg")} color="#ffffff"/>
                <meta name="msapplication-TileColor" content="#ffffff"/>
                <meta name="theme-color" content="#1c1823"/>
            </Head>
            <StyledWrapper>
                <Navigation offsetToggleButton={lastVideoPageProps && !isVideoPage}/>
                {lastVideoPageProps && (
                    <VideoPlayer {...lastVideoPageProps} background={!isVideoPage}/>
                )}
                <StyledContainer>
                    {!!pageProps.year && (
                        <Column style={{ "--gap": "16px" }}>
                            <YearNavigation year={pageProps.year} yearList={pageProps.yearList} />
                            <SeasonNavigation year={pageProps.year} season={pageProps.season} seasonList={pageProps.seasonList} />
                        </Column>
                    )}
                    {pageProps.isSearch && (
                        <SearchNavigation/>
                    )}
                    <Component {...pageProps}/>
                    {devModeSettingValue === "enabled" && lastBuildAt && (
                        <Text
                            variant="small"
                            color="text-disabled"
                            link
                            onClick={() => revalidate().then(() => alert("Page has been rebuilt!"), () => alert("Page could not be rebuilt!"))}
                        >
                            Page was last built {Math.round((Date.now() - lastBuildAt) / 60000)} minutes ago. Click to start a rebuild.
                        </Text>
                    )}
                </StyledContainer>
                <Footer/>
            </StyledWrapper>
            <ToastHub/>
        </MultiContextProvider>
    );
}

function MultiContextProvider({ providers = [], children }) {
    return providers.reduce((previousValue, [ Provider, props = {} ]) => (
        <Provider {...props}>
            {previousValue}
        </Provider>
    ), children);
}

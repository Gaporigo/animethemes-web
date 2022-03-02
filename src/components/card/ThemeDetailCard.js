import {
    StyledRow,
    StyledSequence,
    StyledThemeCard,
    StyledVideoList,
    StyledVideoListContainer
} from "./ThemeDetailCard.style";
import { VideoButton } from "components/button";
import { SongTitleWithArtists, ThemeEntryTags } from "components/utils";
import { Text } from "components/text";
import { ThemeMenu } from "components/menu";

export function ThemeDetailCard({ theme }) {
    return (
        <StyledThemeCard>
            <StyledRow>
                <StyledSequence>{theme.slug}</StyledSequence>
                <SongTitleWithArtists song={theme.song}/>
                <ThemeMenu theme={theme}/>
            </StyledRow>
            {theme.entries.map(entry => (
                <StyledRow key={entry.version || 0}>
                    <StyledSequence secondary>{!!entry.version && `v${entry.version}`}</StyledSequence>
                    <Text color="text-muted">
                        <ThemeEntryTags entry={entry}/>
                    </Text>
                    <StyledVideoListContainer>
                        {!!entry.videos && (
                            <StyledVideoList>
                                {entry.videos.map((video, index) => (
                                    <VideoButton
                                        key={index}
                                        anime={theme.anime}
                                        theme={theme}
                                        entry={entry}
                                        video={video}
                                    />
                                ))}
                            </StyledVideoList>
                        )}
                    </StyledVideoListContainer>
                </StyledRow>
            ))}
        </StyledThemeCard>
    );
}

import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Button } from "components/button";
import theme from "theme";
import { slideIn } from "styles/animations";

export const StyledPlayer = styled(motion.div)`
    z-index: ${theme.zIndices.videoPlayer};
    
    ${(props) => props.$background ? css`
        position: fixed;

        @media (max-width: 720px) {
            display: flex;
            
            width: 100%;
            height: 4rem;
            bottom: 0;
            left: 0;
            
            background-color: ${theme.colors["solid"]};

            animation: ${slideIn()} 500ms ease;
            
            & ${StyledVideo} {
                width: auto;
                aspect-ratio: auto;
            }
        }
        @media (min-width: 721px) {
            width: 352px;
            bottom: 1rem;
            left: 1rem;
            
            box-shadow: ${theme.shadows.high};
        }
    ` : css`
        @media (max-width: 720px) and (orientation: portrait) {
            position: sticky;
            top: 0;
        }
        @media (min-width: 721px) {
            margin: 1.5rem auto 0 auto;
            width: 100%;
            max-width: 1100px;
        }
    `}
`;

export const StyledVideo = styled.video`
    width: 100%;
    max-height: calc(100vh - 96px);
    aspect-ratio: 16 / 9;
    outline: none;
    background-color: rgb(0, 0, 0);
`;

export const StyledOverlay = styled.div`        
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    @media (max-width: 720px) {
        flex-direction: row-reverse;
    }
    @media (min-width: 721px) {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: ${theme.zIndices.videoPlayerOverlay};

        gap: 8px;
        
        opacity: ${(props) => props.force ? 1 : 0};
        background-color: hsla(0 0% 0% / 0.5);

        transition: opacity 500ms 1000ms;
        
        &:hover {
            opacity: 1;

            transition: opacity 250ms;
        }
    }
`;

export const StyledPlayerButton = styled(Button).attrs({ variant: "silent", isCircle: true })`
    padding: 1rem;
    
    @media (max-width: 720px) {
        font-size: 1rem;
        
        ${(props) => props.hideOnMobile && css`
            display: none;
        `}
    }
    @media (min-width: 721px) {
        font-size: ${(props) => props.size || "1rem"};
    }
`;

export const StyledPlayerInfo = styled.div`
    flex: 1;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    min-width: 0;
    padding: 0.5rem 1rem;
    gap: 4px;
    
    @media (min-width: 721px) {
        display: none;
    }
`;

export const StyledPlayerProgress = styled.div`
    position: absolute;
    top: -4px;
    left: 0;
    
    width: 100%;
    height: 4px;
    
    background-color: ${theme.colors["background"]};

    @media (min-width: 721px) {
        display: none;
    }
`;

export const StyledPlayerProgressBar = styled.div`
    width: 0;
    height: 100%;
    
    background-color: ${theme.colors["text-primary"]};
`;

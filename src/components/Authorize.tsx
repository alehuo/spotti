import React from "react";
import { Logo } from "./ui/Logo";
import { authUrl } from "../services/AuthService";
import { AuthorizeLink } from "./ui/AuthorizeLink";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faGithub } from "@fortawesome/free-brands-svg-icons";

const AuthorizeWrapper = styled.div`
  width: 100%;
  height: 100%;
  grid-column-start: span 2;
  grid-row-start: span 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ContentWrapper = styled.div`
  padding: 16px;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-self: center;
`;

const Link = styled.a`
  color: ${props => props.theme.green1};
  font-size: 14pt;
`;

export const Authorize: React.FC = () => (
  <AuthorizeWrapper>
    <ContentWrapper>
      <Logo>SPOTTI</Logo>
      <p>A Spotify webplayer.</p>
      <p>
        <Link href="https://github.com/alehuo/spotify-web-dashboard" target="__blank" rel="noreferrer noopener">
          <FontAwesomeIcon icon={faGithub} />
          &nbsp;&nbsp;Source code
        </Link>
      </p>
    </ContentWrapper>
    <ContentWrapper>
      <AuthorizeLink href={authUrl}>
        <FontAwesomeIcon icon={faSpotify} />
        &nbsp;&nbsp;Authorize Spotify
      </AuthorizeLink>
    </ContentWrapper>
  </AuthorizeWrapper>
);

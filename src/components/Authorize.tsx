import React from "react";
import { Logo } from "./ui/Logo";
import { authUrl } from "../services/AuthService";
import { AuthorizeLink } from "./ui/AuthorizeLink";
import styled from "styled-components";

const AuthorizeWrapper = styled.div`
  background-color: ${props => props.theme.darkBlue1};
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
  align-content: center;
  justify-content: center;
  align-self: center;
`;

export const Authorize: React.FC = () => (
  <AuthorizeWrapper>
    <ContentWrapper>
      <Logo>Spotti</Logo>
    </ContentWrapper>
    <ContentWrapper>
      <AuthorizeLink href={authUrl}>Authorize Spotify</AuthorizeLink>
    </ContentWrapper>
  </AuthorizeWrapper>
);

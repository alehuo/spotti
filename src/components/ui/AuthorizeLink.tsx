import styled from "styled-components";

export const AuthorizeLink = styled.a`
  color: ${props => props.theme.black1};
  background-color: ${props => props.theme.green1};
  border: 2px solid ${props => props.theme.green1};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color, border;
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 32px;
  height: 64px;
  padding-left: 32px;
  padding-right: 32px;
  text-decoration: none;
  &:hover {
    background-color: ${props => props.theme.black1};
    border: 2px solid ${props => props.theme.green1};
    color: ${props => props.theme.green1};
  }
`;

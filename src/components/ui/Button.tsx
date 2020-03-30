import styled from "styled-components";

export const Button = styled.button`
  background-color: transparent;
  color: ${props => props.theme.textColor};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  border: 0;
  font-size: 1.6em;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.green1};
  }
`;

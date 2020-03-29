import styled from "styled-components";

export const Button = styled.button`
  background-color: transparent;
  color: ${props => props.theme.textColor};
  border: 0;
  font-size: 1.6em;
  &:hover {
    cursor: pointer;
    color: rgb(31, 209, 31);
  }
`;

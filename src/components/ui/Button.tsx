import { styled } from "../../customStyled";

export const Button = styled.button`
  display: inline-block;
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  border: 0;
  font-size: 1.6em;
  &:hover {
    cursor: pointer;
  }
`;

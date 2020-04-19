import { styled } from "../../customStyled";

interface ButtonProps {
  animate?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-block;
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  ${(props) =>
    props.animate &&
    `
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color, color;
  `};
  border: 0;
  font-size: 1.6em;
  &:hover {
    cursor: pointer;
  }
`;

Button.defaultProps = {
  animate: true,
};

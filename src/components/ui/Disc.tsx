import React from "react";
import { styled } from "../../customStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";

export const StyledFa = styled(FontAwesomeIcon)`
  transition: color 2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${(props) => props.theme.textColor};
`;

const RotatingStyledFa = styled(StyledFa)`
  animation: rotating 2s linear infinite;
  @-webkit-keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface DiscProps {
  rotating: boolean;
}

export const Disc: React.FC<DiscProps> = ({ rotating }) =>
  rotating ? (
    <RotatingStyledFa icon={faCompactDisc} />
  ) : (
    <StyledFa icon={faCompactDisc} />
  );

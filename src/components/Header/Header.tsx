import React from "react";
import {
  StyledHeader,
  StyledLogo,
  StyledHeaderContent,
} from "./Header.style.ts";

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <StyledHeaderContent>
        <StyledLogo src="/coreLogo.webp" alt="CORE" />
      </StyledHeaderContent>
    </StyledHeader>
  );
};

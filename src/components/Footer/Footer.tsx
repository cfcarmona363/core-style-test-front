import React from "react";
import { Button } from "../Button/Button";
import {
  StyledFooter,
  StyledFooterContent,
  StyledButtonGroup,
} from "./Footer.style";

interface FooterProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  showPrevious: boolean;
  isLastStep: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  showPrevious,
  isLastStep,
}) => {
  return (
    <StyledFooter>
      <StyledFooterContent>
        <StyledButtonGroup>
          {showPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              Anterior
            </Button>
          )}
          {isLastStep ? (
            <Button type="button" onClick={onSubmit}>
              Enviar
            </Button>
          ) : (
            <Button type="button" onClick={onNext}>
              Siguiente
            </Button>
          )}
        </StyledButtonGroup>
      </StyledFooterContent>
    </StyledFooter>
  );
};

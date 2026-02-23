import React from "react";
import {
  StyledStepSidebar,
  StyledStepTitle,
  StyledStepDescription,
} from "./StepIndicator.style.ts";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
  stepDescriptions?: string[];
}

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Cuéntanos sobre ti",
  2: "Selecciona tus características de estilo",
  3: "Elige tu preferencia de ajuste",
  4: "¿Cuánto tiempo tienes disponible?",
  5: "¿Cuál es tu identidad de género?",
  6: "¿Dónde estás ubicado?",
  7: "Privacidad y comunicaciones",
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  stepDescriptions = STEP_DESCRIPTIONS,
}) => {
  const stepTitle = steps[currentStep - 1];
  const stepDescription = stepDescriptions[currentStep];

  return (
    <StyledStepSidebar>
      <StyledStepTitle>{stepTitle}</StyledStepTitle>
      <StyledStepDescription>{stepDescription}</StyledStepDescription>
    </StyledStepSidebar>
  );
};

import React from "react";
import {
  StyledStepIndicator,
  StyledStep,
  StyledStepNumber,
  StyledStepLabel,
} from "./StepIndicator.style.ts";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <StyledStepIndicator>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <StyledStep key={index} isActive={isActive} isCompleted={isCompleted}>
            <StyledStepNumber isActive={isActive} isCompleted={isCompleted}>
              {isCompleted ? "✓" : stepNumber}
            </StyledStepNumber>
            <StyledStepLabel isActive={isActive}>{step}</StyledStepLabel>
          </StyledStep>
        );
      })}
    </StyledStepIndicator>
  );
};

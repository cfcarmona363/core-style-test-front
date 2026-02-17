import styled from "styled-components";

interface StepProps {
  isActive: boolean;
  isCompleted: boolean;
}

export const StyledStepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.border};
    z-index: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};

    &::before {
      display: none;
    }
  }
`;

export const StyledStep = styled.div<StepProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  position: relative;
  z-index: 1;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
`;

export const StyledStepNumber = styled.div<StepProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1em;
  background-color: ${({ isActive, isCompleted, theme }) =>
    isActive || isCompleted ? theme.colors.primary : theme.colors.white};
  color: ${({ isActive, isCompleted, theme }) =>
    isActive || isCompleted ? theme.colors.white : theme.colors.textSecondary};
  border: 2px solid
    ${({ isActive, isCompleted, theme }) =>
      isActive || isCompleted ? theme.colors.primary : theme.colors.border};
  transition: all 0.3s ease;
`;

export const StyledStepLabel = styled.span<{ isActive: boolean }>`
  font-size: 0.875em;
  height: 21px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
  }
`;

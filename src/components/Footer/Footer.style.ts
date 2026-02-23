import styled from "styled-components";

export const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
    padding-bottom: max(
      ${({ theme }) => theme.spacing.md},
      env(safe-area-inset-bottom)
    );
  }
`;

export const StyledFooterContent = styled.div`
  max-width: 1100px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};

    button {
      width: 100%;
    }
  }
`;

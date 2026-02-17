import styled from "styled-components";

export const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledHeaderContent = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledLogo = styled.img`
  height: 100px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 60px;
  }
`;

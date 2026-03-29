import styled from "styled-components";
import { theme } from "../../styles/theme";

export const GlassCard = styled.div`
  ${theme.glassmorphism.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.base};

  &:hover {
    ${theme.glassmorphism.medium};
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg}, ${theme.shadows.glow};
  }
`;

export const GlassCardInteractive = styled(GlassCard)`
  cursor: pointer;

  &:active {
    transform: translateY(-2px);
  }
`;

export const GlassButton = styled.button`
  ${theme.glassmorphism.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    ${theme.glassmorphism.medium};
    background-color: ${(props) =>
      props.primary ? theme.colors.primary : "initial"};
    box-shadow:
      ${theme.shadows.md},
      ${(props) => (props.primary ? theme.shadows.glow : "none")};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GlassButtonPrimary = styled(GlassButton)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};

  &:hover {
    background-color: ${theme.colors.primaryLight};
    box-shadow: ${theme.shadows.lg}, ${theme.shadows.glow};
  }
`;

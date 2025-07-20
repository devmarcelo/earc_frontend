// src/components/Shared/Social/SocialLoginButton.tsx
import React from "react";
import Button, { type ButtonProps } from "../Button";
import { FcGoogle } from "react-icons/fc";

// Tipos para fácil expansão futura
type Provider = "google"; // | "github" | "facebook" | "microsoft" etc.

interface SocialLoginButtonProps
  extends Omit<ButtonProps, "variant" | "leftIcon" | "children"> {
  provider: Provider;
  children?: React.ReactNode;
}

const providerConfig = {
  google: {
    icon: <FcGoogle size={22} />,
    text: "Entrar com Google",
    variant: "outline" as const,
  },
  // Adicione outros provedores no futuro aqui!
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  children,
  ...props
}) => {
  const config = providerConfig[provider];
  return (
    <Button
      variant={config.variant}
      leftIcon={config.icon}
      fullWidth
      {...props}
    >
      {children ?? config.text}
    </Button>
  );
};

export default SocialLoginButton;


import React from "react";
import { 
  Button as ChakraButton, 
  ButtonProps as ChakraButtonProps 
} from "@chakra-ui/react";

export interface ButtonProps extends ChakraButtonProps {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", asChild = false, children, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);
Button.displayName = "Button";

export { Button };

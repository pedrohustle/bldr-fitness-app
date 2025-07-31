import React from 'react';
import { cva } from 'class-variance-authority';

// Utilitário para juntar classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Variantes do botão com Tailwind
const buttonVariants = cva(
  "w-full font-bold flex items-center justify-center gap-2 rounded-lg transition-colors duration-200",
  {
    variants: {
      variant: {
        primary: "bg-black text-yellow-400 hover:text-yellow-300 font-montserrat px-2 py-1 rounded-full border-3 border-yellow-500 transition max-w-xs w-full mx-auto",
        outline: "bg-black text-yellow-400 hover:text-yellow-300 font-montserrat px-2 py-1 rounded-full border-3 border-yellow-500 transition max-w-xs w-full mx-auto",
        ghost: "bg-null text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors border border-gray-300 hover:shadow-md",
        success:"bg-green-500 text-white hover:bg-green-600 active:bg-green-700",
            },
      size: {
        sm: "py-2 text-sm",
        md: "py-4 text-lg",
        lg: "py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Componente Button
function Button({
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  children,
  disabled = false,
  ...props
}) {  
  const disabledClasses = disabled
  ? 'opacity-50 cursor-not-allowed'
  : 'cursor-pointer';

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), disabledClasses, className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };

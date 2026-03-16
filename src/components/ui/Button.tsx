import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-primary hover:bg-primary-dark active:bg-primary-dark text-white',
  danger: 'bg-danger hover:bg-danger-dark active:bg-danger-dark text-white',
  ghost: 'bg-surface-light hover:bg-surface text-white',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-colors min-h-12 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}

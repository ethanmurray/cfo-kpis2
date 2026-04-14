import { useClientStore } from '../stores/clientStore'

interface ClientLogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export default function NorthernTrustLogo({ variant = 'full', className = '' }: ClientLogoProps) {
  const config = useClientStore((s) => s.config)
  const { primary, accent } = config.colors
  const { monogram, textLines } = config.logo

  // Build monogram SVG paths from letters
  const monogramLetters = monogram.split('')

  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill={primary} />
        <text
          x="24"
          y="30"
          fontFamily="system-ui, -apple-system"
          fontSize={monogramLetters.length > 2 ? '14' : '16'}
          fontWeight="700"
          fill={accent}
          textAnchor="middle"
          letterSpacing="-0.5"
        >
          {monogram}
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon */}
      <rect width="48" height="48" rx="8" fill={primary} />
      <text
        x="24"
        y="30"
        fontFamily="system-ui, -apple-system"
        fontSize={monogramLetters.length > 2 ? '14' : '16'}
        fontWeight="700"
        fill={accent}
        textAnchor="middle"
        letterSpacing="-0.5"
      >
        {monogram}
      </text>

      {/* Text lines */}
      {textLines.map((line, i) => (
        <text
          key={i}
          x="56"
          y={textLines.length === 1 ? 32 : 14 + i * 18}
          fontFamily="system-ui, -apple-system"
          fontSize="15"
          fontWeight="600"
          fill={primary}
          letterSpacing="-0.5"
        >
          {line}
        </text>
      ))}
    </svg>
  )
}

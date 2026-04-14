interface NorthernTrustLogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export default function NorthernTrustLogo({ variant = 'full', className = '' }: NorthernTrustLogoProps) {
  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* NT Monogram */}
        <rect width="48" height="48" rx="8" fill="#006747"/>
        <path d="M12 14 L12 34 L16 34 L16 22 L22 34 L26 34 L26 14 L22 14 L22 26 L16 14 Z" fill="#D4AF37"/>
        <path d="M28 14 L28 18 L32 18 L32 34 L36 34 L36 18 L40 18 L40 14 Z" fill="#D4AF37"/>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon */}
      <rect width="48" height="48" rx="8" fill="#006747"/>
      <path d="M12 14 L12 34 L16 34 L16 22 L22 34 L26 34 L26 14 L22 14 L22 26 L16 14 Z" fill="#D4AF37"/>
      <path d="M28 14 L28 18 L32 18 L32 34 L36 34 L36 18 L40 18 L40 14 Z" fill="#D4AF37"/>

      {/* Text */}
      <text x="56" y="24" fontFamily="system-ui, -apple-system" fontSize="15" fontWeight="600" fill="#006747" letterSpacing="-0.5">NORTHERN</text>
      <text x="56" y="38" fontFamily="system-ui, -apple-system" fontSize="15" fontWeight="600" fill="#006747" letterSpacing="-0.5">TRUST</text>
    </svg>
  )
}

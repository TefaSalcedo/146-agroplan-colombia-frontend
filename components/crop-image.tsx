'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const FALLBACK_SRC = '/placeholder.svg'

interface CropImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

function resolveImageSrc(src: string | undefined): string {
  if (!src) return FALLBACK_SRC
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
    return src
  }
  if (src.startsWith('/crops/')) {
    return src
  }
  if (src.startsWith('crops/')) {
    return `/${src}`
  }
  return src
}

export function CropImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className,
  priority,
}: CropImageProps) {
  const resolvedSrc = resolveImageSrc(src)
  const [imageSrc, setImageSrc] = useState<string>(resolvedSrc)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImageSrc(resolvedSrc)
    setHasError(false)
  }, [resolvedSrc])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImageSrc(FALLBACK_SRC)
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      unoptimized
      className={cn(
        fill ? 'absolute inset-0 h-full w-full' : '',
        'object-cover',
        className,
      )}
      onError={hasError ? undefined : handleError}
    />
  )
}

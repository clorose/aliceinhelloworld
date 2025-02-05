// components/common/BlogImage.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

// 이미지 경로를 직접 하드코딩하지 않고 props로 받아서 처리하는게 더 나았을 것 같네요
const FALLBACK_IMAGE = '/image/baseball_fly_error.png'

export const BlogImage = ({ src, alt, width, height, className }: BlogImageProps) => {
  const [imgSrc, setImgSrc] = useState(src) // src를 state로 관리

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
      loading="lazy"
    />
  )
}
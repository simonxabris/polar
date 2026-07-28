import { type ImgHTMLAttributes } from 'react'

interface StaticImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean
}

/** Incremental-migration shim for next/image. */
export const StaticImage = ({
  priority,
  alt = '',
  ...props
}: StaticImageProps) => (
  // eslint-disable-next-line polar/no-next-image
  <img alt={alt} loading={priority ? 'eager' : 'lazy'} {...props} />
)

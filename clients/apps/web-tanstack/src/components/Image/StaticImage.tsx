import { type ImgHTMLAttributes } from 'react'

interface StaticImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
}

/** Incremental-migration shim for next/image. */
export const StaticImage = ({
  fill,
  priority,
  unoptimized: _unoptimized,
  alt = '',
  style,
  ...props
}: StaticImageProps) => (
  // eslint-disable-next-line polar/no-next-image
  <img
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    style={
      fill
        ? {
            ...style,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }
        : style
    }
    {...props}
  />
)

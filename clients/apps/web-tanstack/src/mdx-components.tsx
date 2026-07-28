import { BlogHero } from '@/components/Blog/BlogHero'
import { StaticImage } from '@/components/Image/StaticImage'
import ProseWrapper from '@/components/MDX/ProseWrapper'
import { Table } from '@polar-sh/orbit/ui/table'
import type { MDXComponents } from 'mdx/types'
import { twMerge } from 'tailwind-merge'

interface ImportedImageSrc {
  src: string
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    BlogHero,
    BodyWrapper(props) {
      return (
        <ProseWrapper className="flex w-full flex-col items-center md:max-w-7xl!">
          {props.children}
        </ProseWrapper>
      )
    },
    InnerHeaderWrapper(props) {
      return (
        <div
          className={twMerge(
            'prose-headings:font-medium prose-h1:leading-tight prose-headings:text-balance pt-6 text-center md:max-w-3xl md:pt-0 md:pb-6',
            props.className,
          )}
        >
          {props.children}
        </div>
      )
    },
    InnerWrapper(props) {
      return (
        <div
          className={twMerge(
            'flex w-full flex-col md:max-w-2xl',
            props.className,
          )}
        >
          {props.children}
        </div>
      )
    },
    table: (props) => <Table {...props} />,
    img: (props) => {
      if (typeof props.src === 'string') {
        return <img {...props} />
      }

      let className = props.className || ''
      const src = props.src as unknown as ImportedImageSrc
      const modeMatch = src.src.match(/(light|dark)\.[a-z0-9]{8}\.[a-z]+/)

      if (modeMatch?.[1] === 'light') {
        className = `${className} dark:hidden`
      } else if (modeMatch?.[1] === 'dark') {
        className = `${className} hidden dark:block`
      }

      return <StaticImage {...props} className={className} />
    },
  }
}

export const mdxComponents = useMDXComponents({})

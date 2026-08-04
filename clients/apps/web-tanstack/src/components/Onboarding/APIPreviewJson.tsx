import { Box } from '@polar-sh/orbit/Box'
import type { ReactNode } from 'react'

export interface PreviewLine {
  key: string
  fingerprint: string
  indent: number
  content: ReactNode
}

export function PreviewJson({
  lines,
  flashedKeys,
}: {
  lines: PreviewLine[]
  flashedKeys: Set<string>
}) {
  return (
    <Box flexDirection="column">
      {lines.map((line, index) => (
        <Box key={line.key}>
          <p
            className="mr-3 shrink-0 text-right font-mono text-[11px] leading-relaxed text-gray-300 select-none dark:text-gray-700"
            style={{ minWidth: '1.5ch' }}
          >
            {index + 1}
          </p>
          <code
            className="flex-1 font-mono text-[11px] leading-relaxed break-words"
            style={{ paddingLeft: `${line.indent}ch` }}
          >
            <code
              className={`-mx-1 rounded px-1 transition-colors duration-500 ${
                flashedKeys.has(line.key)
                  ? 'bg-blue-500/15 dark:bg-blue-400/10'
                  : 'bg-transparent'
              }`}
            >
              {line.content}
            </code>
          </code>
        </Box>
      ))}
    </Box>
  )
}

export function buildPreviewLines(
  object: Record<string, unknown>,
  prefix = '',
  indent = 2,
): PreviewLine[] {
  const entries = Object.entries(object)
  const keyPrefix = prefix ? `${prefix}.` : ''
  if (entries.length === 0 && indent === 2) {
    return [
      line('empty', '{}', 0, <code className="text-gray-400">{'{ }'}</code>),
    ]
  }

  const lines: PreviewLine[] = []
  if (indent === 2) {
    lines.push(
      line('__open', '{', 0, <code className="text-gray-400">{'{'}</code>),
    )
  }

  entries.forEach(([key, value], index) => {
    const comma = index < entries.length - 1
    const fullKey = `${keyPrefix}${key}`
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(
        line(
          `${fullKey}-open`,
          `${fullKey}:{`,
          indent,
          <>
            <JsonKey value={key} />
            <code className="text-gray-400">{': {'}</code>
          </>,
        ),
        ...buildPreviewLines(
          value as Record<string, unknown>,
          fullKey,
          indent + 2,
        ),
        line(
          `${fullKey}-close`,
          `${fullKey}:}${comma ? ',' : ''}`,
          indent,
          <code className="text-gray-400">{`}${comma ? ',' : ''}`}</code>,
        ),
      )
      return
    }
    if (Array.isArray(value) && value.length > 0) {
      lines.push(
        line(
          `${fullKey}-open`,
          `${fullKey}:[`,
          indent,
          <>
            <JsonKey value={key} />
            <code className="text-gray-400">{': ['}</code>
          </>,
        ),
      )
      value.forEach((item, itemIndex) => {
        lines.push(
          line(
            `${fullKey}-${itemIndex}`,
            `${fullKey}-${itemIndex}:${JSON.stringify(item)}`,
            indent + 2,
            <>
              <JsonValue value={item} />
              {itemIndex < value.length - 1 ? (
                <code className="text-gray-400">,</code>
              ) : null}
            </>,
          ),
        )
      })
      lines.push(
        line(
          `${fullKey}-close`,
          `${fullKey}:]${comma ? ',' : ''}`,
          indent,
          <code className="text-gray-400">{`]${comma ? ',' : ''}`}</code>,
        ),
      )
      return
    }
    lines.push(
      line(
        fullKey,
        `${fullKey}:${JSON.stringify(value)}`,
        indent,
        <>
          <JsonKey value={key} />
          <code className="text-gray-400">: </code>
          <JsonValue value={value} />
          {comma ? <code className="text-gray-400">,</code> : null}
        </>,
      ),
    )
  })

  if (indent === 2) {
    lines.push(
      line('__close', '}', 0, <code className="text-gray-400">{'}'}</code>),
    )
  }
  return lines
}

function line(
  key: string,
  fingerprint: string,
  indent: number,
  content: ReactNode,
): PreviewLine {
  return { key, fingerprint, indent, content }
}

function JsonKey({ value }: { value: string }) {
  return (
    <code className="text-blue-600 dark:text-blue-400">{`"${value}"`}</code>
  )
}

function JsonValue({ value }: { value: unknown }) {
  if (typeof value === 'string') {
    return (
      <code className="text-green-600 dark:text-green-400">{`"${value}"`}</code>
    )
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return (
      <code className="text-amber-600 dark:text-amber-400">
        {String(value)}
      </code>
    )
  }
  if (Array.isArray(value) && value.length === 0) {
    return <code className="text-gray-400">[]</code>
  }
  return <code className="text-gray-400">null</code>
}

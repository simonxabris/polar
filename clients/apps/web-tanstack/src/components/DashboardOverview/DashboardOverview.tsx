import {
  CHART_RANGES,
  useOverviewMetrics,
  type ChartRange,
} from '@/hooks/useOverviewMetrics'
import type { schemas } from '@polar-sh/client'
import { Alert, Button, SegmentedControl } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { Settings2 } from 'lucide-react'
import { useState } from 'react'
import { DashboardWidgets } from './DashboardWidgets'
import { OverviewMetricCard } from './OverviewMetricCard'

export const DashboardOverview = ({
  organization,
}: {
  organization: schemas['OrganizationWithRole']
}) => {
  const canReadAnalytics = organization.permissions.includes('analytics:read')
  const { data, error, interval, isLoading, metrics, range, setRange } =
    useOverviewMetrics(organization)
  const [hoveredPeriodIndex, setHoveredPeriodIndex] = useState<number | null>(
    null,
  )

  return (
    <Box
      minHeight="100%"
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingHorizontal={{ base: 'l', md: '2xl' }}
      paddingVertical="2xl"
      className="text-gray-900 dark:text-white"
    >
      <Box
        width="100%"
        maxWidth={1280}
        flexDirection="column"
        rowGap={{ base: '2xl', md: '4xl' }}
      >
        <Box flexDirection="column" rowGap="xl">
          <Box
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'stretch', md: 'center' }}
            justifyContent="between"
            rowGap="l"
          >
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
              Overview
            </h1>
            {canReadAnalytics ? (
              <Box alignItems="center" justifyContent="between" columnGap="l">
                <SegmentedControl
                  options={CHART_RANGES}
                  value={range}
                  onChange={(value) => setRange(value as ChartRange)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  wrapperClassNames="gap-x-2"
                  aria-label="Customize"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  <Box as="span" display={{ base: 'none', md: 'inline' }}>
                    Customize
                  </Box>
                </Button>
              </Box>
            ) : null}
          </Box>

          {!canReadAnalytics ? (
            <Alert
              variant="warning"
              title="Restricted access"
              description="You don't have permission to view analytics."
            />
          ) : error ? (
            <Alert
              variant="warning"
              title="Could not load overview metrics"
              description="Please refresh the page and try again."
            />
          ) : (
            <div className="dark:border-polar-700 flex flex-col overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 flex-col [clip-path:inset(1px_1px_1px_1px)] lg:grid-cols-2 2xl:grid-cols-3">
                {metrics.map((metric, index) => (
                  <OverviewMetricCard
                    key={metric}
                    data={data}
                    metric={metric}
                    interval={interval}
                    loading={isLoading}
                    featured={index === 0}
                    hoveredPeriodIndex={hoveredPeriodIndex}
                    onHoverPeriodChange={setHoveredPeriodIndex}
                  />
                ))}
              </div>
            </div>
          )}
        </Box>

        <DashboardWidgets organization={organization} />
      </Box>
    </Box>
  )
}

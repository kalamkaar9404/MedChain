'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

interface SystemStatusProps {
  components: Array<{
    name: string
    status: 'operational' | 'degraded' | 'down'
    uptime: number
    lastChecked: string
  }>
}

const STATUS_ICONS = {
  operational: <CheckCircle2 className='w-5 h-5 text-green-600' />,
  degraded: <AlertCircle className='w-5 h-5 text-yellow-600' />,
  down: <XCircle className='w-5 h-5 text-red-600' />,
}

const STATUS_COLORS = {
  operational: 'bg-green-50',
  degraded: 'bg-yellow-50',
  down: 'bg-red-50',
}

export function SystemStatus({ components }: SystemStatusProps) {
  const overallStatus = components.every((c) => c.status === 'operational') ? 'operational' : components.some((c) => c.status === 'down') ? 'down' : 'degraded'
  const operationalCount = components.filter((c) => c.status === 'operational').length

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='w-5 h-5' />
              System Status
            </CardTitle>
            <CardDescription>Health of platform components</CardDescription>
          </div>
          <Badge variant={overallStatus === 'operational' ? 'default' : 'destructive'}>
            {operationalCount}/{components.length} Operational
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {components.map((component) => (
            <div key={component.name} className={`p-4 rounded-lg border ${STATUS_COLORS[component.status]}`}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {STATUS_ICONS[component.status]}
                  <div>
                    <p className='font-semibold text-sm'>{component.name}</p>
                    <p className='text-xs text-muted-foreground'>Uptime: {component.uptime}%</p>
                  </div>
                </div>
                <div className='text-right text-xs text-muted-foreground'>
                  <p>Last checked</p>
                  <p>{new Date(component.lastChecked).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

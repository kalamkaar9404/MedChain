'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsChartsProps {
  claimsOverTime: Array<{ month: string; count: number; amount: number }>
  claimsByStatus: Array<{ name: string; value: number }>
  riskDistribution: Array<{ range: string; count: number }>
}

const STATUS_COLORS = {
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
  PENDING: '#f59e0b',
  UNDER_REVIEW: '#3b82f6',
  CLAWBACK_INITIATED: '#8b5cf6',
}

export function AnalyticsCharts({ claimsOverTime, claimsByStatus, riskDistribution }: AnalyticsChartsProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Claims Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Claims Volume & Amount Over Time</CardTitle>
          <CardDescription>Monthly trend of claim submissions and total amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={claimsOverTime}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis yAxisId='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Tooltip />
              <Legend />
              <Line yAxisId='left' type='monotone' dataKey='count' stroke='#3b82f6' name='Count' />
              <Line yAxisId='right' type='monotone' dataKey='amount' stroke='#8b5cf6' name='Amount ($)' />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Claims by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Status</CardTitle>
          <CardDescription>Distribution of claims across different statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie data={claimsByStatus} cx='50%' cy='50%' labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill='#8884d8' dataKey='value'>
                {claimsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#gray'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>Risk Score Distribution</CardTitle>
          <CardDescription>Claims grouped by risk score ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='range' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill='#3b82f6' name='Number of Claims' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

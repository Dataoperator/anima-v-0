import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

interface PerformanceStats {
  performance?: {
    avg_response_time: number;
    requests_per_second: number;
    error_rate: number;
  };
}

// Change to named export
export const AdminMetrics: React.FC = () => {
  // Rest of the component implementation stays exactly the same
  const { data: stats, loading, error } = useAdminMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading metrics: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quantum">Quantum State</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.performance_history || []}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" />
                  <XAxis dataKey="timestamp" className="text-white/60" />
                  <YAxis className="text-white/60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(34,197,94,0.2)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="response_time"
                    name="Response Time"
                    stroke="#22c55e"
                    fill="url(#performanceGradient)"
                    className="animate-[glow_2s_ease-in-out_infinite]"
                  />
                  <Area
                    type="monotone"
                    dataKey="throughput"
                    name="Throughput"
                    stroke="#3b82f6"
                    fill="url(#performanceGradient)"
                    className="animate-[glow_2s_ease-in-out_infinite]"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-black/30 border-green-500/10">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-500/80 font-mono">Average Response Time</div>
                    <div className="text-xl text-green-500 font-mono mt-1">
                      {(stats?.performance?.avg_response_time || 0).toFixed(2)}ms
                    </div>
                    <div className="h-1 bg-green-500/20 rounded-full mt-2">
                      <div 
                        className="h-full bg-green-500 rounded-full animate-[glow_2s_ease-in-out_infinite]"
                        style={{ width: `${Math.min((stats?.performance?.avg_response_time || 0) / 2, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border-green-500/10">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-500/80 font-mono">Request Throughput</div>
                    <div className="text-xl text-green-500 font-mono mt-1">
                      {(stats?.performance?.requests_per_second || 0).toFixed(1)} req/s
                    </div>
                    <div className="h-1 bg-green-500/20 rounded-full mt-2">
                      <div 
                        className="h-full bg-green-500 rounded-full animate-[glow_2s_ease-in-out_infinite]"
                        style={{ width: `${Math.min((stats?.performance?.requests_per_second || 0) * 5, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border-green-500/10">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-500/80 font-mono">Error Rate</div>
                    <div className="text-xl text-green-500 font-mono mt-1">
                      {(stats?.performance?.error_rate || 0).toFixed(2)}%
                    </div>
                    <div className="h-1 bg-green-500/20 rounded-full mt-2">
                      <div 
                        className="h-full bg-red-500 rounded-full animate-[glow_2s_ease-in-out_infinite]"
                        style={{ width: `${Math.min((stats?.performance?.error_rate || 0), 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum">
          <Card>
            <CardContent>
              <div className="text-center text-white/60">
                Quantum state metrics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardContent>
              <div className="text-center text-white/60">
                Network metrics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Export both named and default for maximum compatibility
export default AdminMetrics;
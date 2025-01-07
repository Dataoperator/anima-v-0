import React, { useState, useEffect } from 'react';
import { Alert } from '@/types/alerts';
import { AlertCircle, Bell, AlertTriangle, Info } from 'lucide-react';

interface AlertsPanelProps {
    alerts: Alert[];
    onResolveAlert?: (id: string) => void;
    onDismissAlert?: (id: string) => void;
}

type AlertCategory = 'All' | 'System' | 'Security' | 'Performance';
type AlertSeverity = 'All' | 'Critical' | 'Warning' | 'Info';

interface AlertCounts {
    critical: number;
    warning: number;
    info: number;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
    alerts,
    onResolveAlert,
    onDismissAlert
}) => {
    const [selectedCategory, setSelectedCategory] = useState<AlertCategory>('All');
    const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity>('All');
    const [showResolved, setShowResolved] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getAlertIcon = (level: Alert['level']) => {
        switch (level) {
            case 'critical':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (searchTerm && !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (selectedCategory !== 'All' && alert.type !== selectedCategory.toLowerCase()) {
            return false;
        }

        if (selectedSeverity !== 'All' && alert.level !== selectedSeverity.toLowerCase()) {
            return false;
        }

        if (!showResolved && alert.resolved) {
            return false;
        }

        return true;
    });

    const alertCounts: AlertCounts = {
        critical: alerts.filter(a => a.level === 'critical' && !a.resolved).length,
        warning: alerts.filter(a => a.level === 'warning' && !a.resolved).length,
        info: alerts.filter(a => a.level === 'info' && !a.resolved).length
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">System Alerts</h2>
                <div className="flex space-x-2">
                    {alertCounts.critical > 0 && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-md text-sm">
                            {alertCounts.critical} Critical
                        </span>
                    )}
                    {alertCounts.warning > 0 && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-sm">
                            {alertCounts.warning} Warning
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search alerts..."
                    className="flex-1 min-w-[200px] px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select
                    className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as AlertCategory)}
                >
                    <option value="All">All Categories</option>
                    <option value="System">System</option>
                    <option value="Security">Security</option>
                    <option value="Performance">Performance</option>
                </select>

                <select
                    className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity)}
                >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                    <option value="Info">Info</option>
                </select>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showResolved}
                        onChange={(e) => setShowResolved(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-500"
                    />
                    <span>Show Resolved</span>
                </label>
            </div>

            <div className="space-y-4">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg border ${
                                alert.resolved
                                    ? 'bg-gray-800/50 border-gray-700'
                                    : alert.level === 'critical'
                                    ? 'bg-red-500/10 border-red-500/50'
                                    : alert.level === 'warning'
                                    ? 'bg-yellow-500/10 border-yellow-500/50'
                                    : 'bg-gray-800/50 border-gray-700'
                            }`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    {getAlertIcon(alert.level)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">
                                            {alert.type}
                                        </span>
                                        {alert.resolved && (
                                            <div className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full">
                                                Resolved
                                            </div>
                                        )}
                                    </div>
                                    
                                    <p className="mt-1 text-sm text-gray-300">
                                        {alert.message}
                                    </p>
                                    
                                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                        {alert.resolvedBy && (
                                            <span>Resolved by {alert.resolvedBy}</span>
                                        )}
                                    </div>
                                </div>

                                {!alert.resolved && (
                                    <div className="flex-shrink-0 flex space-x-2">
                                        <button
                                            onClick={() => onResolveAlert?.(alert.id)}
                                            className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md transition-colors"
                                        >
                                            Resolve
                                        </button>
                                        <button
                                            onClick={() => onDismissAlert?.(alert.id)}
                                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                        <p>No alerts found</p>
                        {searchTerm || selectedCategory !== 'All' || selectedSeverity !== 'All' ? (
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};
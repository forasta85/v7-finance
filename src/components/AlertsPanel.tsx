import { Alert } from '../App';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onDismiss: (alertId: string) => void;
}

export function AlertsPanel({ alerts, onAlertClick, onDismiss }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return null;
  }

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  return (
    <div className="space-y-2">
      {unreadAlerts.map((alert) => {
        const Icon = {
          warning: AlertTriangle,
          info: Info,
          success: CheckCircle,
          danger: XCircle,
        }[alert.type];

        const colors = {
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800',
          success: 'bg-green-50 border-green-200 text-green-800',
          danger: 'bg-red-50 border-red-200 text-red-800',
        }[alert.type];

        const iconColors = {
          warning: 'text-yellow-600',
          info: 'text-blue-600',
          success: 'text-green-600',
          danger: 'text-red-600',
        }[alert.type];

        return (
          <div
            key={alert.id}
            className={`${colors} border rounded-lg p-4 flex items-start gap-3 shadow-sm`}
          >
            <Icon className={`${iconColors} flex-shrink-0 mt-0.5`} size={20} />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
              <p className="text-sm opacity-90">{alert.message}</p>
              
              {alert.actionLabel && (
                <button
                  onClick={() => onAlertClick(alert)}
                  className="mt-2 text-sm font-medium hover:underline"
                >
                  {alert.actionLabel} →
                </button>
              )}
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

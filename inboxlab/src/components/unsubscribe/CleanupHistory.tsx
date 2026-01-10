"use client";

interface CleanupHistoryItem {
  id: string;
  timestamp: Date;
  removedCount: number;
  listSizeBefore: number;
  listSizeAfter: number;
  removedTypes: {
    unsubscribes: number;
    bounces: number;
    complaints: number;
  };
}

interface CleanupHistoryProps {
  history: CleanupHistoryItem[];
}

export default function CleanupHistory({ history }: CleanupHistoryProps) {
  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalRemoved = () => {
    return history.reduce((sum, item) => sum + item.removedCount, 0);
  };

  const getEfficiency = (item: CleanupHistoryItem) => {
    const reduction = item.listSizeBefore - item.listSizeAfter;
    const efficiency = (reduction / item.removedCount) * 100;
    return Math.min(efficiency, 100).toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Cleanup History</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{getTotalRemoved()}</div>
          <div className="text-xs text-gray-600">Total Removed</div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-900">
                  Cleanup #{history.length - index}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(item.timestamp)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">
                  -{item.removedCount}
                </div>
                <div className="text-xs text-gray-600">
                  {item.listSizeBefore} → {item.listSizeAfter}
                </div>
              </div>
            </div>

            {/* Removal Breakdown */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-sm font-bold text-red-700">{item.removedTypes.unsubscribes}</div>
                <div className="text-xs text-red-600">Unsubscribes</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="text-sm font-bold text-orange-700">{item.removedTypes.bounces}</div>
                <div className="text-xs text-orange-600">Bounces</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-sm font-bold text-purple-700">{item.removedTypes.complaints}</div>
                <div className="text-xs text-purple-600">Complaints</div>
              </div>
            </div>

            {/* Efficiency */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cleanup Efficiency</span>
                <span className="font-medium text-green-600">{getEfficiency(item)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${getEfficiency(item)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Summary Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {history.length}
              </div>
              <div className="text-xs text-gray-600">Total Cleanups</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(getTotalRemoved() / history.length)}
              </div>
              <div className="text-xs text-blue-600">Avg per Cleanup</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskTrendChart = ({ history }) => {
  if (!history || history.length < 2) {
    return (
      <div className="empty-chart-state">
        <p>Insufficient data for trend analysis. Tracking will begin after your next assessment.</p>
      </div>
    );
  }

  // Transform date to readable format
  const data = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="risk-trend-chart" style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
          />
          <Legend />
          
          <Line type="monotone" dataKey="overall_score" stroke="#3b82f6" strokeWidth={2} name="Overall Health Risk" dot={{ r: 4 }} />
          {/* Individual disease lines could be added here if the data is dense enough, 
              but keeping it simple with Overall Score for now to avoid clutter */}
          <Line type="monotone" dataKey="Kidney Disease" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="Heart Disease" stroke="#f97316" strokeWidth={1} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-legend-note" style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
        *Dashed lines represent individual organ risks
      </div>
    </div>
  );
};

export default RiskTrendChart;

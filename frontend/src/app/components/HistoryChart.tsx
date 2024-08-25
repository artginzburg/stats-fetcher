'use client';

// 1. Import controllers, elements, etc. which you'll use
import {
  Chart as ChartS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
// 2. Register them
ChartS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

import { Line } from 'react-chartjs-2';

export default function HistoryChart() {
  return (
    <>
      <Line
        data={{
          labels: ['Hi', 'You', 'Beautiful'],
          datasets: [
            {
              label: 'Mustapp',
              data: [0.1, 0.5, 0.2],
              borderColor: 'red',
              backgroundColor: 'rgba(255,0,0,0.5)',
            },
            { label: 'NPM Downloads', data: [2, 0, 1] },
          ],
        }}
        options={{
          // plugins: { legend: { display: false } },
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Chart.js Line Chart',
            },
          },
          elements: {
            line: {
              tension: 0,
              borderWidth: 2,
              borderColor: 'rgb(47,97,68)',
              // fill: 'start',
              backgroundColor: 'rgba(47,97,68, 0.3)',
            },
            point: {
              backgroundColor: 'blue',
              borderColor: 'rgba(255,200,255,1)',
              radius: 5,
              // hitRadius: 50,
            },
          },
        }}
      />
    </>
  );
}

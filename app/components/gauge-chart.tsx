"use client"

interface GaugeChartProps {
  probability: number
}

export default function GaugeChart({ probability }: GaugeChartProps) {
  const percentage = Math.round(probability * 100)
  const rotation = probability * 180 - 90

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#e5e7eb" strokeWidth="20" strokeLinecap="round" />
          {/* Colored arc based on probability */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={probability > 0.5 ? "#ef4444" : "#10b981"}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${probability * 251.2} 251.2`}
          />
          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 90)`}
            className="transition-transform duration-1000 ease-out"
          />
          {/* Center dot */}
          <circle cx="100" cy="90" r="6" fill="#1e293b" />
        </svg>
      </div>
      <div className="text-center mt-4">
        <div className="text-4xl font-bold text-slate-900">{percentage}%</div>
        <div className="text-sm text-slate-600 mt-1">Probabilidad de Spam</div>
      </div>
    </div>
  )
}

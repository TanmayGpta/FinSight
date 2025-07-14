import React, { useState } from 'react'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const sidebarItems = [
    { icon: '🏠', active: true },
    { icon: '📊', active: false },
    { icon: '⏰', active: false },
    { icon: '📹', active: false },
    { icon: '📱', active: false },
    { icon: '🔧', active: false },
    { icon: '➡️', active: false }
  ]

  const dataUploadItems = [
    { icon: '📤', text: 'Upload your CSV files', avatars: ['👤', '👤'] },
    { icon: '📊', text: 'Quarterly Insights', avatars: ['👤'] },
    { icon: '📈', text: 'KPI Overview', avatars: ['👤', '👤'] },
    { icon: '📅', text: 'Forecast Q4 2024', avatars: ['👤', '👤', '👤'] },
    { icon: '📥', text: 'Import CSV Data', avatars: ['👤'] }
  ]

  const kpiData = [
    { label: 'Total Revenue: $2M', period: 'This Quarter', color: 'bg-blue-500' },
    { label: 'Average ROA: 15%', period: 'This Quarter', color: 'bg-blue-500' },
    { label: 'Forecasted Revenue: $2.5M', period: 'Next Quarter', color: 'bg-blue-500' }
  ]

  const recentUpdates = [
    { 
      avatar: '👤', 
      name: 'John D', 
      action: 'in KPI Overview', 
      description: 'Attached are the latest figures...',
      time: '2h ago'
    },
    { 
      avatar: '👤', 
      name: 'Sarah L', 
      action: 'in Forecast Q4 2024', 
      description: 'New projections are ready for...',
      time: '4h ago'
    },
    { 
      avatar: '👤', 
      name: 'David M', 
      action: 'in CSV Database', 
      description: 'Amortization schedule',
      time: '3h ago'
    }
  ]

  const forecastData = [
    { month: 'Q1', value: 60 },
    { month: 'Q2', value: 80 },
    { month: 'Q3', value: 90 },
    { month: 'Q4', value: 100 }
  ]

  const quickActions = [
    { title: 'Quarterly reports', color: 'bg-slate-200', active: false },
    { title: 'Forecasting Revenue trends', color: 'bg-blue-500', active: true },
    { title: 'Datamining KPI summary', color: 'bg-slate-200', active: false }
  ]

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-700">
      {/* Sidebar */}
      <div className="w-16 bg-blue-600 flex flex-col items-center py-5">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`w-10 h-10 flex items-center justify-center mb-4 rounded-lg cursor-pointer text-lg ${
              item.active ? 'bg-blue-700' : 'bg-transparent'
            }`}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-8 py-5 bg-white border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              FinSight
            </h1>
            <p className="text-slate-500 text-sm">Your financial dashboard</p>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2.5 pl-4 pr-10 border border-slate-200 rounded-lg w-80 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                🔍
              </span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer">
              👤
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 flex gap-8">
          {/* Left Column */}
          <div className="flex-none w-96">
            {/* Data Upload Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold mb-5 text-slate-800">
                Data Upload
              </h2>
              
              {dataUploadItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center py-3 cursor-pointer ${
                    index < dataUploadItems.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <span className="text-base mr-4">{item.icon}</span>
                  <span className="flex-1 text-sm text-slate-700">{item.text}</span>
                  <div className="flex gap-1">
                    {item.avatars.map((avatar, avatarIndex) => (
                      <div
                        key={avatarIndex}
                        className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs"
                      >
                        {avatar}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button className="mt-4 px-4 py-2 bg-slate-100 text-slate-500 rounded-md text-xs cursor-pointer hover:bg-slate-200">
                Load Summary
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            {/* KPI Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold mb-5 text-slate-800">
                Key Performance Indicators
              </h2>
              
              {kpiData.map((kpi, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-4 ${
                    index < kpiData.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${kpi.color} mr-4`}></div>
                    <span className="text-sm text-slate-700">{kpi.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{kpi.period}</span>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex gap-5">
              {/* Recent Updates */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-4 text-slate-800">
                  Recent Updates
                </h3>
                
                {recentUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="flex items-start mb-4 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 text-sm">
                      {update.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-0.5">
                        {update.name} {update.action}
                      </div>
                      <div className="text-xs text-slate-700">
                        {update.description}
                      </div>
                    </div>
                    <span className="text-base text-slate-500">›</span>
                  </div>
                ))}

                {/* Quick Actions */}
                <div className="mt-5">
                  <div className="flex gap-2 flex-wrap">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 rounded-md text-xs cursor-pointer ${
                          action.active 
                            ? `${action.color} text-white` 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forecast Chart */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-4 text-slate-800">
                  Forecast
                </h3>
                
                {/* Simple Bar Chart */}
                <div className="flex items-end h-32 gap-4 mb-5">
                  {forecastData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t mb-2"
                        style={{ height: `${data.value}px` }}
                      ></div>
                      <span className="text-xs text-slate-500">{data.month}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-slate-500 mb-4 text-center">
                  Run a forecast to review future trends
                </p>
                
                <button className="w-full py-2.5 bg-blue-500 text-white rounded-md text-xs font-medium cursor-pointer hover:bg-blue-600">
                  Initiate Forecast
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
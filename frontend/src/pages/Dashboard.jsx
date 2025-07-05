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
    { label: 'Total Revenue: $2M', period: 'This Quarter', color: '#3b82f6' },
    { label: 'Average ROA: 15%', period: 'This Quarter', color: '#3b82f6' },
    { label: 'Forecasted Revenue: $2.5M', period: 'Next Quarter', color: '#3b82f6' }
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
    }
  ]

  const forecastData = [
    { month: 'Q1', value: 60 },
    { month: 'Q2', value: 80 },
    { month: 'Q3', value: 90 },
    { month: 'Q4', value: 100 }
  ]

  const quickActions = [
    { title: 'Quarterly reports', color: '#e2e8f0' },
    { title: 'Forecasting Revenue trends', color: '#3b82f6', active: true },
    { title: 'Datamining KPI summary', color: '#e2e8f0' }
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '60px', 
        backgroundColor: '#2563eb', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px 0' 
      }}>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              backgroundColor: item.active ? '#1d4ed8' : 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ 
          padding: '20px 30px', 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>
              FinSight
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Your financial dashboard</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Filter by company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 40px 10px 15px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  width: '300px',
                  fontSize: '14px',
                  backgroundColor: '#f8fafc'
                }}
              />
              <span style={{ 
                position: 'absolute', 
                right: '15px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}>
                🔍
              </span>
            </div>
            
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              👤
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ flex: 1, padding: '30px', display: 'flex', gap: '30px' }}>
          {/* Left Column */}
          <div style={{ flex: '0 0 400px' }}>
            {/* Data Upload Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '25px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>
                Data Upload
              </h2>
              
              {dataUploadItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < dataUploadItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '15px' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: '14px', color: '#334155' }}>{item.text}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {item.avatars.map((avatar, avatarIndex) => (
                      <div
                        key={avatarIndex}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px'
                        }}
                      >
                        {avatar}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#64748b',
                cursor: 'pointer'
              }}>
                Load Summary
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: 1 }}>
            {/* KPI Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '25px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>
                Key Performance Indicators
              </h2>
              
              {kpiData.map((kpi, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 0',
                    borderBottom: index < kpiData.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: kpi.color,
                      marginRight: '15px'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#334155' }}>{kpi.label}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{kpi.period}</span>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Recent Updates */}
              <div style={{ 
                flex: 1,
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '25px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                  Recent Updates
                </h3>
                
                {recentUpdates.map((update, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '14px'
                    }}>
                      {update.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                        {update.name} {update.action}
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155' }}>
                        {update.description}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px', color: '#64748b' }}>›</span>
                  </div>
                ))}

                {/* Quick Actions */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          backgroundColor: action.active ? action.color : '#f1f5f9',
                          color: action.active ? 'white' : '#64748b',
                          cursor: 'pointer'
                        }}
                      >
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forecast Chart */}
              <div style={{ 
                flex: 1,
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '25px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                  Forecast
                </h3>
                
                {/* Simple Bar Chart */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'end', 
                  height: '120px', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {forecastData.map((data, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${data.value}px`,
                          backgroundColor: '#3b82f6',
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '8px'
                        }}
                      ></div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{data.month}</span>
                    </div>
                  ))}
                </div>
                
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px', textAlign: 'center' }}>
                  Run a forecast to review future trends
                </p>
                
                <button style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
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

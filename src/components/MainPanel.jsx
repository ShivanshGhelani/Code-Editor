import { useState, useEffect, useRef } from 'react'
import CodeEditor from './CodeEditor'
import PreviewPanel from './PreviewPanel'

const MainPanel = ({ 
  currentView, 
  htmlCode, 
  cssFramework, 
  pageOrientation, 
  onViewChange, 
  onCodeChange, 
  onFrameworkChange, 
  onOrientationChange 
}) => {
  const [isToggling, setIsToggling] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    theme: 'vs-dark',
    tabSize: 4,
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    cursorStyle: 'line',
    fontFamily: 'Consolas, Monaco, monospace'
  })
  
  const dropdownRef = useRef(null)

  // Available themes
  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast Dark' },
    { value: 'hc-light', label: 'High Contrast Light' }
  ]

  // Font families
  const fontFamilies = [
    { value: 'Consolas, Monaco, monospace', label: 'Consolas' },
    { value: 'Fira Code, monospace', label: 'Fira Code' },
    { value: 'Source Code Pro, monospace', label: 'Source Code Pro' },
    { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
    { value: 'SF Mono, Monaco, monospace', label: 'SF Mono' }
  ]

  // Cursor styles
  const cursorStyles = [
    { value: 'line', label: 'Line' },
    { value: 'block', label: 'Block' },
    { value: 'underline', label: 'Underline' },
    { value: 'line-thin', label: 'Thin Line' },
    { value: 'block-outline', label: 'Block Outline' },
    { value: 'underline-thin', label: 'Thin Underline' }
  ]

  // Update editor settings
  const updateEditorSettings = (newSettings) => {
    setEditorSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle view toggle with animation
  const handleViewToggle = (newView) => {
    if (newView !== currentView) {
      setIsToggling(true)
      onViewChange(newView)
      setTimeout(() => {
        setIsToggling(false)
      }, 100)
    }
  }

  // Handle opening preview in new tab
  const handleOpenInNewTab = () => {
    if (window.previewContent) {
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(window.previewContent)
        newWindow.document.close()
      }
    }
  }

  // Export functions
  const handleExportPDF = () => {
    if (window.previewContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate - PDF Export</title>
            <style>
              @page { size: ${pageOrientation === 'portrait' ? 'A4 portrait' : 'A4 landscape'}; margin: 0; }
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            ${window.previewContent.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/, '').replace(/<\/body>[\s\S]*?<\/html>/, '')}
          </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    }
    setShowExportDropdown(false)
  }

  const handleExportHTML = () => {
    if (window.previewContent) {
      const blob = new Blob([window.previewContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'certificate.html'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    setShowExportDropdown(false)
  }

  const handleExportPNG = () => {
    alert('PNG export: Right-click on the preview and select "Save as image" or use your browser\'s screenshot feature.')
    setShowExportDropdown(false)
  }

  return (
    <div className="flex-1 flex">
      {/* Left Sidebar with All Controls */}
      <div className="w-80 bg-gradient-to-b from-blue-50 to-white border-r border-blue-200 shadow-sm flex flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-blue-200">
          <h2 className="text-xl font-bold text-blue-900">HTML Code Editor</h2>
          <p className="text-sm text-blue-600 mt-1">Certificate Builder</p>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-6 py-4 space-y-6">
          {/* View Toggle Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">View Mode</h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium transition-colors ${
                  currentView === 'editor' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  Editor
                </span>
                
                <button
                  onClick={() => handleViewToggle(currentView === 'editor' ? 'preview' : 'editor')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${
                    currentView === 'preview' ? 'bg-blue-600' : 'bg-blue-300'
                  }`}
                  disabled={isToggling}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      currentView === 'preview' ? 'translate-x-6' : 'translate-x-1'
                    } ${isToggling ? 'duration-100' : 'duration-200'}`}
                  />
                </button>
                
                <span className={`text-sm font-medium transition-colors ${
                  currentView === 'preview' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  Preview
                </span>
              </div>
              
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="Open Preview in New Tab"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <span className="text-xs">New Tab</span>
              </button>
            </div>
          </div>

          {/* Framework Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">CSS Framework</h3>
            <div className="bg-white rounded-lg border border-blue-200 p-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onFrameworkChange('tailwind')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    cssFramework === 'tailwind'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200'
                  }`}
                  title="Tailwind CSS"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onFrameworkChange('bootstrap')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    cssFramework === 'bootstrap'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200'
                  }`}
                  title="Bootstrap"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.002,4.546L3.78,6.768c-0.291,0.291-0.291,0.762,0,1.053l2.222,2.222c0.291,0.291,0.762,0.291,1.053,0l2.222-2.222 c0.291-0.291,0.291-0.762,0-1.053L7.055,4.546C6.764,4.255,6.293,4.255,6.002,4.546z"/>
                    <path d="M16.945,4.546l-2.222,2.222c-0.291,0.291-0.291,0.762,0,1.053l2.222,2.222c0.291,0.291,0.762,0.291,1.053,0l2.222-2.222 c0.291-0.291,0.291-0.762,0-1.053L17.998,4.546C17.707,4.255,17.236,4.255,16.945,4.546z"/>
                    <path d="M6.002,14.454l-2.222,2.222c-0.291,0.291-0.291,0.762,0,1.053l2.222,2.222c0.291,0.291,0.762,0.291,1.053,0l2.222-2.222 c0.291-0.291,0.291-0.762,0-1.053L7.055,14.454C6.764,14.163,6.293,14.163,6.002,14.454z"/>
                    <path d="M16.945,14.454l-2.222,2.222c-0.291,0.291-0.291,0.762,0,1.053l2.222,2.222c0.291,0.291,0.762,0.291,1.053,0l2.222-2.222 c0.291-0.291,0.291-0.762,0-1.053L17.998,14.454C17.707,14.163,17.236,14.163,16.945,14.454z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Page Orientation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Page Orientation</h3>
            <div className="bg-white rounded-lg border border-blue-200 p-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onOrientationChange('portrait')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    pageOrientation === 'portrait'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 text-current" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" clipRule="evenodd" />
                  </svg>
                  Portrait
                </button>
                <button
                  onClick={() => onOrientationChange('landscape')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    pageOrientation === 'landscape'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 transform rotate-90 text-current" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" clipRule="evenodd" />
                  </svg>
                  Landscape
                </button>
              </div>
            </div>
          </div>

          {/* Editor Settings Panel */}
          {showSettings && (
            <div className="border-t border-blue-200 p-4 bg-gray-50">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Editor Configuration</h4>
                
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={editorSettings.theme}
                    onChange={(e) => updateEditorSettings({ theme: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {themes.map(theme => (
                      <option key={theme.value} value={theme.value}>{theme.label}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size: {editorSettings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={editorSettings.fontSize}
                    onChange={(e) => updateEditorSettings({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={editorSettings.fontFamily}
                    onChange={(e) => updateEditorSettings({ fontFamily: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tab Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tab Size: {editorSettings.tabSize}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={editorSettings.tabSize}
                    onChange={(e) => updateEditorSettings({ tabSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Cursor Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cursor Style</label>
                  <select
                    value={editorSettings.cursorStyle}
                    onChange={(e) => updateEditorSettings({ cursorStyle: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {cursorStyles.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Word Wrap</label>
                    <button
                      onClick={() => updateEditorSettings({ wordWrap: editorSettings.wordWrap === 'on' ? 'off' : 'on' })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        editorSettings.wordWrap === 'on' ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editorSettings.wordWrap === 'on' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Minimap</label>
                    <button
                      onClick={() => updateEditorSettings({ minimap: !editorSettings.minimap })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        editorSettings.minimap ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editorSettings.minimap ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Line Numbers</label>
                    <button
                      onClick={() => updateEditorSettings({ lineNumbers: editorSettings.lineNumbers === 'on' ? 'off' : 'on' })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        editorSettings.lineNumbers === 'on' ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editorSettings.lineNumbers === 'on' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    const defaultSettings = {
                      fontSize: 14,
                      theme: 'vs-dark',
                      tabSize: 4,
                      wordWrap: 'on',
                      minimap: true,
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                      cursorStyle: 'line',
                      fontFamily: 'Consolas, Monaco, monospace'
                    }
                    updateEditorSettings(defaultSettings)
                  }}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="px-6 py-4 border-t border-blue-200 bg-white">
          <div className="flex items-center space-x-2">
            {/* Export Options */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors"
                title="Export Options"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Export</span>
                <svg className={`w-3 h-3 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Export Dropdown Menu */}
              {showExportDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Export as PDF</span>
                    </button>
                    <button
                      onClick={handleExportPNG}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Export as PNG</span>
                    </button>
                    <button
                      onClick={handleExportHTML}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Export as HTML</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
              title="Editor Settings"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Keep both mounted to prevent state loss */}
      <div className="flex-1">
        <div className={`h-full transition-opacity ${isToggling ? 'opacity-70' : 'opacity-100'}`}>
          {/* Editor - Always mounted, visibility controlled by CSS */}
          <div className={`h-full ${currentView === 'editor' ? 'block' : 'hidden'}`}>
            <CodeEditor
              htmlCode={htmlCode}
              onCodeChange={onCodeChange}
              cssFramework={cssFramework}
              pageOrientation={pageOrientation}
              editorSettings={editorSettings}
            />
          </div>
          
          {/* Preview - Always mounted, visibility controlled by CSS */}
          <div className={`h-full ${currentView === 'preview' ? 'block' : 'hidden'}`}>
            <PreviewPanel
              htmlCode={htmlCode}
              cssFramework={cssFramework}
              pageOrientation={pageOrientation}
              onOpenInNewTab={handleOpenInNewTab}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPanel
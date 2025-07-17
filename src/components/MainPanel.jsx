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
  const dropdownRef = useRef(null)

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
    <div className="flex-1 flex flex-col">
      {/* Header with All Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-blue-900">HTML Code Editor</h2>
          
          {/* Framework Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-700">Framework:</span>
            <div className="bg-blue-100 rounded-lg p-1 flex border border-blue-200">
              <button
                onClick={() => onFrameworkChange('tailwind')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  cssFramework === 'tailwind'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={() => onFrameworkChange('bootstrap')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  cssFramework === 'bootstrap'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                }`}
              >
                Bootstrap
              </button>
            </div>
          </div>

          {/* Orientation Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-700">Page:</span>
            <div className="bg-blue-100 rounded-lg p-1 flex border border-blue-200">
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  pageOrientation === 'portrait'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                }`}
              >
                <svg className="w-3 h-3 mr-1 text-current" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" clipRule="evenodd" />
                </svg>
                Portrait
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  pageOrientation === 'landscape'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                }`}
              >
                <svg className="w-3 h-3 mr-1 transform rotate-90 text-current" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" clipRule="evenodd" />
                </svg>
                Landscape
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle and Actions */}
        <div className="flex items-center space-x-4">
          {/* View Toggle Switch */}
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium transition-colors ${
              currentView === 'editor' ? 'text-blue-600' : 'text-blue-400'
            }`}>
              Editor
            </span>
            
            <button
              onClick={() => handleViewToggle(currentView === 'editor' ? 'preview' : 'editor')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 ${
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

          {/* Open in New Tab Button */}
          <div className="h-4 w-px bg-blue-300"></div>
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center space-x-2 px-3 py-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
            title="Open Preview in New Tab"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            <span className="text-sm">New Tab</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center space-x-2 px-3 py-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
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

            {/* Dropdown Menu */}
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Export as PDF
                  </button>
                  <button
                    onClick={handleExportPNG}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Export as PNG
                  </button>
                  <button
                    onClick={handleExportHTML}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                    Export as HTML
                  </button>
                </div>
              </div>
            )}
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
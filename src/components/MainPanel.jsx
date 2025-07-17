import { useState } from 'react'
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

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with All Controls */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">HTML Code Editor</h2>
          
          {/* Framework Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Framework:</span>
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => onFrameworkChange('tailwind')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  cssFramework === 'tailwind'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={() => onFrameworkChange('bootstrap')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  cssFramework === 'bootstrap'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Bootstrap
              </button>
            </div>
          </div>

          {/* Orientation Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Page:</span>
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  pageOrientation === 'portrait'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" clipRule="evenodd" />
                </svg>
                Portrait
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  pageOrientation === 'landscape'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <svg className="w-3 h-3 mr-1 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
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
              currentView === 'editor' ? 'text-blue-400' : 'text-gray-400'
            }`}>
              Editor
            </span>
            
            <button
              onClick={() => handleViewToggle(currentView === 'editor' ? 'preview' : 'editor')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-600'
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
              currentView === 'preview' ? 'text-blue-400' : 'text-gray-400'
            }`}>
              Preview
            </span>
          </div>

          {/* Open in New Tab Button */}
          <div className="h-4 w-px bg-gray-600"></div>
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center space-x-2 px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Open Preview in New Tab"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            <span className="text-sm">New Tab</span>
          </button>
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
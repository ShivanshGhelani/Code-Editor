import { useState } from 'react'
import { Sidebar, MainPanel } from './components'
import './App.css'

function App() {
  // Global state management for HTML Code Editor
  const [cssFramework, setCssFramework] = useState('tailwind') // 'tailwind' | 'bootstrap'
  const [pageOrientation, setPageOrientation] = useState('portrait') // 'portrait' | 'landscape'
  const [currentView, setCurrentView] = useState('editor') // 'editor' | 'preview'
  const [htmlCode, setHtmlCode] = useState('')

  // State management handlers
  const handleFrameworkChange = (framework) => {
    setCssFramework(framework)
  }

  const handleOrientationChange = (orientation) => {
    setPageOrientation(orientation)
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  const handleCodeChange = (code) => {
    setHtmlCode(code)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        cssFramework={cssFramework}
        pageOrientation={pageOrientation}
        onFrameworkChange={handleFrameworkChange}
        onOrientationChange={handleOrientationChange}
      />
      
      <MainPanel
        currentView={currentView}
        htmlCode={htmlCode}
        cssFramework={cssFramework}
        pageOrientation={pageOrientation}
        onViewChange={handleViewChange}
        onCodeChange={handleCodeChange}
      />
      
      {/* Debug info to verify state management */}
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded shadow-lg text-xs">
        <div>Framework: {cssFramework}</div>
        <div>Orientation: {pageOrientation}</div>
        <div>View: {currentView}</div>
        <div>Code length: {htmlCode.length}</div>
      </div>
    </div>
  )
}

export default App

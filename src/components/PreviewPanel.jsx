import { useEffect, useRef, useState } from 'react'
import { generateCompleteHTML } from '../utils/boilerplateTemplates'

const PreviewPanel = ({ htmlCode, cssFramework, pageOrientation, onOpenInNewTab }) => {
  const iframeRef = useRef(null)
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [scale, setScale] = useState(0.7)

  // Calculate optimal scale for A4 page
  const calculateScale = () => {
    if (!containerRef.current) return 0.7
    
    const container = containerRef.current
    const containerWidth = container.clientWidth - 64 // Account for padding
    const containerHeight = container.clientHeight - 64
    
    // A4 dimensions in pixels (96 DPI)
    const a4Width = pageOrientation === 'portrait' ? 794 : 1123
    const a4Height = pageOrientation === 'portrait' ? 1123 : 794
    
    // Calculate scale to fit both width and height
    const scaleX = containerWidth / a4Width
    const scaleY = containerHeight / a4Height
    const optimalScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%
    
    return Math.max(optimalScale, 0.3) // Minimum scale of 30%
  }

  // Update scale when orientation changes or container resizes
  useEffect(() => {
    const updateScale = () => {
      const newScale = calculateScale()
      setScale(newScale)
    }
    
    updateScale()
    
    const resizeObserver = new ResizeObserver(updateScale)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => resizeObserver.disconnect()
  }, [pageOrientation])

  // Generate complete HTML for preview
  useEffect(() => {
    const completeHTML = generateCompleteHTML(cssFramework, pageOrientation, htmlCode)
    
    // Add additional CSS to prevent overflow and scrollbars
    const enhancedHTML = completeHTML.replace(
      '</head>',
      `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          box-sizing: border-box;
        }
        
        body {
          ${pageOrientation === 'portrait' 
            ? 'max-width: 210mm; max-height: 297mm;' 
            : 'max-width: 297mm; max-height: 210mm;'
          }
          overflow: hidden !important;
          position: relative;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Hide any scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Ensure content fits within page */
        .certificate-container {
          overflow: hidden !important;
          max-width: 100%;
          max-height: 100vh;
          box-sizing: border-box;
        }
      </style>
      </head>`
    )
    
    setPreviewContent(enhancedHTML)
    
    // Store in global for new tab functionality
    window.previewContent = enhancedHTML
    
    // Update iframe content
    if (iframeRef.current) {
      setIsLoading(true)
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow.document
      
      doc.open()
      doc.write(enhancedHTML)
      doc.close()
      
      // Handle iframe load and apply additional styles
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          if (iframeDoc && iframeDoc.body) {
            // Apply inline styles to ensure no overflow
            iframeDoc.body.style.overflow = 'hidden'
            iframeDoc.documentElement.style.overflow = 'hidden'
            iframeDoc.body.style.margin = '0'
            iframeDoc.body.style.padding = '0'
          }
        } catch (e) {
          console.log('Cannot access iframe content due to security restrictions')
        }
        setIsLoading(false)
      }
    }
  }, [htmlCode, cssFramework, pageOrientation])

  // Handle opening preview in new tab
  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(previewContent)
      newWindow.document.close()
      onOpenInNewTab && onOpenInNewTab()
    }
  }

  // Handle refresh preview
  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow.document
      
      doc.open()
      doc.write(previewContent)
      doc.close()
      
      // Apply overflow hidden after load
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          if (iframeDoc && iframeDoc.body) {
            iframeDoc.body.style.overflow = 'hidden'
            iframeDoc.documentElement.style.overflow = 'hidden'
          }
        } catch (e) {
          console.log('Cannot access iframe content due to security restrictions')
        }
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Preview Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-gray-800">Live Preview</span>
          {isLoading && (
            <div className="flex items-center space-x-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Updating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Page info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              {cssFramework.toUpperCase()}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              {pageOrientation.toUpperCase()}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh Preview"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Open in New Tab"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content - A4 Page View */}
      <div 
        ref={containerRef}
        className="flex-1 bg-gray-200 overflow-hidden"
      >
        <div className="h-full flex items-center justify-center p-8 overflow-hidden">
          {/* A4 Page Container with proper dimensions */}
          <div 
            className="bg-white shadow-xl border border-gray-400 relative rounded overflow-hidden"
            style={{
              // A4 dimensions in pixels (at 96 DPI: 1mm = 3.78px)
              width: pageOrientation === 'portrait' ? '794px' : '1123px',
              height: pageOrientation === 'portrait' ? '1123px' : '794px',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              flexShrink: 0,
            }}
          >
            {/* Page content iframe with no scrollbars */}
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0 block rounded"
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin"
              scrolling="no"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                backgroundColor: 'white',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            />
            
            {/* Page info overlay */}
            <div 
              className="absolute text-xs text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border"
              style={{
                top: `-${20 / scale}px`,
                left: '0',
                transform: `scale(${1 / scale})`,
                transformOrigin: 'left center',
              }}
            >
              A4 {pageOrientation} • {pageOrientation === 'portrait' ? '210×297mm' : '297×210mm'} • {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Page: A4 {pageOrientation}
            </span>
            <span>
              Dimensions: {pageOrientation === 'portrait' ? '210×297mm' : '297×210mm'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Preview updates automatically
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel
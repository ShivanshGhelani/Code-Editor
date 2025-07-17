# Implementation Plan

- [x] 1. Set up project structure and core state management





  - Create component directory structure in src/components
  - Implement main App component with global state management for cssFramework, pageOrientation, currentView, and htmlCode
  - Set up React hooks for state management (useState for framework, orientation, view mode, and HTML content)
  - _Requirements: 1.1, 5.1, 6.1, 7.1_


- [ ] 2. Create boilerplate template system



  - Implement boilerplate template objects for Tailwind CSS and Bootstrap with portrait/landscape variants
  - Create utility functions to generate complete HTML boilerplate based on framework and orientation selections
  - Add A4 page sizing CSS rules for both portrait (210mm x 297mm) and landscape (297mm x 210mm) orientations
  - _Requirements: 5.2, 5.3, 6.2, 6.3, 8.1, 8.2, 8.3_

- [ ] 3. Build sidebar component with framework and orientation controls
  - Create Sidebar component with toggle controls for CSS framework selection (Tailwind/Bootstrap)
  - Implement orientation toggle control (Portrait/Landscape) in the sidebar
  - Add visual feedback and clear labeling for current selections
  - Connect sidebar controls to global state management with proper event handlers
  - _Requirements: 5.1, 6.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 4. Implement code editor component with protected boilerplate
  - Create CodeEditor component with textarea or code editor interface
  - Implement protected boilerplate area that cannot be edited by users
  - Add syntax highlighting for HTML code
  - Position cursor below protected boilerplate code when editor loads
  - Handle code changes and update global HTML state while preserving protected content
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 8.4, 8.5_

- [ ] 5. Create preview panel with live HTML rendering
  - Build PreviewPanel component using iframe with srcdoc attribute for isolated rendering
  - Implement real-time preview updates when HTML code changes
  - Apply selected CSS framework styles in preview rendering
  - Handle preview updates with debouncing for performance optimization
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Build main panel with view toggle functionality
  - Create MainPanel component that houses both CodeEditor and PreviewPanel
  - Implement beautiful toggle button to switch between code editor and preview modes
  - Add visual state management for current view mode (editor/preview)
  - Ensure smooth transitions between editor and preview views
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 7. Add open in new tab functionality
  - Create "open in new tab" icon button next to the view toggle button
  - Implement new tab opening functionality using window.open() with complete HTML content
  - Generate complete HTML document by combining boilerplate + user content + closing tags
  - Ensure CSS framework is properly loaded in the new tab
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Integrate dynamic boilerplate updates
  - Connect framework and orientation changes to boilerplate template updates
  - Update CodeEditor protected content when settings change
  - Refresh preview panel when boilerplate changes
  - Preserve user-written content below protected area during updates
  - _Requirements: 5.4, 5.5, 6.4, 6.5, 8.5_

- [ ] 9. Implement responsive layout and styling
  - Apply Tailwind CSS classes for responsive sidebar and main panel layout
  - Create mobile-friendly collapsible sidebar
  - Implement responsive main panel that stacks on smaller screens
  - Style all components with consistent design patterns and proper spacing
  - _Requirements: 7.4_

- [ ] 10. Add error handling and user feedback
  - Implement error handling for malformed HTML in preview
  - Add loading states for CSS framework switching
  - Create fallback mechanisms for CDN loading failures
  - Add visual feedback for successful operations and error states
  - _Requirements: 2.4, 5.4, 7.5_

- [ ] 11. Create comprehensive test suite
  - Write unit tests for all components (Sidebar, CodeEditor, PreviewPanel, MainPanel)
  - Test state management functions and boilerplate template generation
  - Create integration tests for framework switching and orientation changes
  - Add end-to-end tests for complete user workflows
  - _Requirements: All requirements validation_

- [ ] 12. Optimize performance and finalize integration
  - Implement debouncing for preview updates to avoid excessive re-rendering
  - Add React.memo and useMemo optimizations for expensive operations
  - Test cross-browser compatibility for preview rendering
  - Integrate all components into main App component and verify complete functionality
  - _Requirements: 1.3, 2.3, 3.4, 4.4_
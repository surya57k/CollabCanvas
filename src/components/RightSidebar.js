import React, { useState } from 'react';
import CollaboratorsPanel from './CollaboratorsPanel';
import CommandInterface from './CommandInterface';
import CameraPreview from './CameraPreview';
import '../styles/RightSidebar.css';

const templates = {
  blank: { name: 'Blank Canvas', icon: '📄', id: 'blank' },
  kanban: { name: 'Kanban Board', icon: '📋', id: 'kanban' },
  mindmap: { name: 'Mind Map', icon: '🧠', id: 'mindmap' },
  businessModel: { name: 'Business Model Canvas', icon: '💼', id: 'businessModel' },
  weeklyPlanner: { name: 'Weekly Planner', icon: '📅', id: 'weeklyPlanner' },
  retrospective: { name: 'Team Retrospective', icon: '🔄', id: 'retrospective' },
  userJourney: { name: 'User Journey Map', icon: '🚶', id: 'userJourney' }
};

const RightSidebar = ({ collaborators, loadTemplate, onCommandExecute, darkMode, canvasRef }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [sidebarSection, setSidebarSection] = useState('templates'); // templates, commands, camera
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTemplateSelect = (templateId) => {
    setActiveTemplate(templateId);
    loadTemplate(templateId); // Pass just the template ID
  };

  const handleClearCanvas = () => {
    onCommandExecute({ params: { action: 'clear' } });
    setShowClearConfirm(false);
  };

  const renderTemplateSection = () => (
    <div className="templates-wrapper">
      <div className="section-header">
        <h3>Templates</h3>
        <div className="template-actions">
          <span className="template-count">{Object.keys(templates).length} available</span>
          <button 
            className="clear-canvas-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Clear Canvas
          </button>
        </div>
      </div>
      {showClearConfirm && (
        <div className="clear-confirm">
          <p>Are you sure you want to clear the canvas?</p>
          <div className="clear-confirm-buttons">
            <button onClick={handleClearCanvas} className="confirm-yes">Yes, Clear</button>
            <button onClick={() => setShowClearConfirm(false)} className="confirm-no">Cancel</button>
          </div>
        </div>
      )}
      <div className="template-grid">
        {Object.entries(templates).map(([id, template]) => (
          <button
            key={id}
            className={`template-item ${activeTemplate === id ? 'active' : ''}`}
            onClick={() => handleTemplateSelect(id)}
          >
            <span className="template-icon">{template.icon}</span>
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderNavigationTabs = () => (
    <div className="sidebar-navigation">
      <button 
        className={`nav-tab ${sidebarSection === 'templates' ? 'active' : ''}`}
        onClick={() => setSidebarSection('templates')}
      >
        📑 Templates
      </button>
      <button 
        className={`nav-tab ${sidebarSection === 'commands' ? 'active' : ''}`}
        onClick={() => setSidebarSection('commands')}
      >
        ⌨️ Commands
      </button>
      <button 
        className={`nav-tab ${sidebarSection === 'camera' ? 'active' : ''}`}
        onClick={() => setSidebarSection('camera')}
      >
        📷 Camera
      </button>
    </div>
  );

  return (
    <aside className={`right-sidebar ${darkMode ? 'dark' : ''}`}>
      <div className="collaborators-panel">
        <CollaboratorsPanel collaborators={collaborators} />
      </div>
      
      {renderNavigationTabs()}

      <div className="sidebar-content">
        {sidebarSection === 'templates' && renderTemplateSection()}
        {sidebarSection === 'commands' && (
          <div className="command-interface">
            <CommandInterface 
              onCommandExecute={onCommandExecute}
              darkMode={darkMode}
            />
          </div>
        )}
        {sidebarSection === 'camera' && (
          <div className="camera-preview-wrapper">
            <CameraPreview 
                darkMode={darkMode} 
                canvasRef={canvasRef}
                onHandMove={({ x, y, isDrawing }) => {
                    if (isDrawing && canvasRef.current) {
                    // Trigger drawing on the canvas
                    const event = new MouseEvent('mousemove', {
                        clientX: x,
                        clientY: y
                    });
                    canvasRef.current.dispatchEvent(event);
                    }
                }}
                />
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;

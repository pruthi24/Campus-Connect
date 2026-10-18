import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState } from 'react';
import * as Icons from './Icons';
import {
  INITIAL_ANONYMOUS_COMPLAINTS,
  INITIAL_COMMITTEE_DECISIONS,
  INITIAL_RESOLVED_COMPLAINTS,
  FREQUENTLY_REPORTED_ISSUES
} from '../mockData';

export default function Complaints({ complaints, setComplaints, currentUser }) {
  // Navigation State
  const [activeSubTab, setActiveSubTab] = useState('raise'); // 'raise' | 'my' | 'anonymous' | 'reviewed' | 'resolved'

  // Datasets states (for interactive session updates)
  const [anonComplaints, setAnonComplaints] = useState(INITIAL_ANONYMOUS_COMPLAINTS);
  const [resolvedComplaints, setResolvedComplaints] = useState(INITIAL_RESOLVED_COMPLAINTS);
  const [freqIssues, setFreqIssues] = useState(FREQUENTLY_REPORTED_ISSUES);
  const [committeeDecisions] = useState(INITIAL_COMMITTEE_DECISIONS);

  // Form States (Raise tab)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel & Facilities');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Feedback states
  const [toastMsg, setToastMsg] = useState('');

  // Filtering states (My complaints tab)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Categories list
  const categories = [
    'Hostel & Facilities',
    'Academic',
    'Infrastructure',
    'Library',
    'Transportation',
    'IT & Network',
    'Canteen',
    'Administration',
    'Others'
  ];

  // Helper to map category to responsible department
  const getAssignedDeptForCategory = (cat) => {
    switch (cat) {
      case 'Hostel & Facilities': return 'Hostel Warden Office';
      case 'Academic': return 'Academic Dean Cell';
      case 'Infrastructure': return 'Estate Maintenance Office';
      case 'Library': return 'Library Operations Department';
      case 'Transportation': return 'Transport Division';
      case 'IT & Network': return 'IT Operations Department';
      case 'Canteen': return 'Food & Catering Inspection Team';
      case 'Administration': return 'Administrative Registry';
      default: return 'Grievance Redressal Committee';
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Mock File Upload change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type
      });
      showToast('Attachment uploaded successfully! 📁');
    }
  };

  // Save draft locally (simulate)
  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter at least a title to save a draft.');
      return;
    }
    const draftData = { title, category, priority, location, description, isAnonymous, uploadedFile };
    localStorage.setItem('gita_complaint_draft', JSON.stringify(draftData));
    showToast('Complaint saved as Draft! 💾');
  };

  // Load draft if exists
  const handleLoadDraft = () => {
    const savedDraft = localStorage.getItem('gita_complaint_draft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setTitle(parsed.title || '');
      setCategory(parsed.category || 'Hostel & Facilities');
      setPriority(parsed.priority || 'Medium');
      setLocation(parsed.location || '');
      setDescription(parsed.description || '');
      setIsAnonymous(parsed.isAnonymous || false);
      setUploadedFile(parsed.uploadedFile || null);
      showToast('Draft loaded successfully! 📂');
    } else {
      showToast('No saved draft found.');
    }
  };

  // Submit Complaint
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const ticketId = `GITA-2026-${Math.floor(100 + Math.random() * 900)}`;
    const submissionDate = new Date().toISOString().split('T')[0];

    const newTicket = {
      id: ticketId,
      userId: currentUser?.id || 'guest',
      userName: isAnonymous ? 'Anonymous Student' : (currentUser?.name || 'Student'),
      userAvatar: isAnonymous ? null : (currentUser?.avatar || null),
      title,
      category,
      urgency: priority,
      date: submissionDate,
      status: 'Pending',
      description,
      location: location || 'Not Specified',
      assignedDept: getAssignedDeptForCategory(category),
      lastUpdated: 'Complaint registered and queued for verification.',
      evidence: uploadedFile ? uploadedFile.name : null,
      createdAt: new Date().toISOString()
    };

    // Append to own complaints list
    setComplaints([newTicket, ...complaints]);

    // Persist to Firestore
    try {
      addDoc(collection(db, 'complaints'), {
        ...newTicket,
        serverCreated: serverTimestamp()
      }).catch(err => console.warn('Firestore ticket sync:', err));
    } catch(e) {
      console.warn('Complaints addDoc error:', e);
    }

    // If anonymous, add to public anonymous complaints too
    if (isAnonymous) {
      const newAnon = {
        id: `ANON-${Math.floor(100 + Math.random() * 900)}`,
        title,
        category,
        description,
        status: 'Submitted',
        upvotes: 1,
        department: newTicket.assignedDept,
        date: submissionDate,
        upvoted: true
      };
      setAnonComplaints([newAnon, ...anonComplaints]);
    }

    // Reset Form
    setTitle('');
    setLocation('');
    setDescription('');
    setIsAnonymous(false);
    setUploadedFile(null);
    localStorage.removeItem('gita_complaint_draft');

    showToast(`Ticket ${ticketId} submitted successfully! 🚀`);
    setActiveSubTab('my'); // Auto redirect to My Complaints tab
  };

  // Upvote frequently reported issue
  const handleFreqUpvote = (id) => {
    setFreqIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        if (issue.upvoted) return issue; // Limit to one upvote
        return { ...issue, count: issue.count + 1, upvoted: true };
      }
      return issue;
    }));
    showToast('Thank you for verifying this issue! +1 counted. 📈');
  };

  // Upvote anonymous complaint
  const handleAnonUpvote = (id) => {
    setAnonComplaints(prev => prev.map(c => {
      if (c.id === id) {
        if (c.upvoted) return c;
        return { ...c, upvotes: c.upvotes + 1, upvoted: true };
      }
      return c;
    }));
    showToast('Upvoted public anonymous complaint. 👥');
  };

  // Stepper Status values helper
  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Assigned': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      default: return 0;
    }
  };

  const getAnonStatusStepIndex = (status) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'In Review': return 1;
      case 'Action Taken': return 2;
      default: return 0;
    }
  };

  // Filtering for My Complaints
  const filteredMyComplaints = complaints.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="complaints-management-system animate-slide-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-alert animate-slide-in">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2-COLUMN SERVICE DESK GRID */}
      <div className="complaints-layout-grid">
        
        {/* LEFT COLUMN: NAVIGATION & COMPACT EMERGENCY CONTACTS */}
        <aside className="complaints-sidebar">
          
          {/* Vertical Menu Navigation */}
          <div className="sidebar-nav-card card">
            <div className="vertical-nav-list">
              <button 
                className={`vertical-nav-btn ${activeSubTab === 'raise' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('raise')}
              >
                ✍️ Raise Complaint
              </button>
              <button 
                className={`vertical-nav-btn ${activeSubTab === 'my' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('my')}
              >
                📋 My Complaints ({complaints.length})
              </button>
              <button 
                className={`vertical-nav-btn ${activeSubTab === 'anonymous' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('anonymous')}
              >
                👥 Anonymous Feed ({anonComplaints.length})
              </button>
              <button 
                className={`vertical-nav-btn ${activeSubTab === 'reviewed' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('reviewed')}
              >
                ⚖️ Reviewed Requests
              </button>
              <button 
                className={`vertical-nav-btn ${activeSubTab === 'resolved' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('resolved')}
              >
                ✅ Resolved Database
              </button>
            </div>
          </div>

          {/* Compact Emergency Contacts Section */}
          <div className="emergency-contacts-card card animate-slide-in">
            <h4 className="emergency-card-title flex align-center gap-6">
              <Icons.AlertTriangle size={14} className="urgent-color" />
              <span>Emergency Contacts</span>
            </h4>

            <div className="contacts-compact-list">
              {/* Contact 1 */}
              <div className="contact-compact-item flex justify-between align-center">
                <div className="contact-details">
                  <strong>Hostel Warden</strong>
                  <span className="contact-phone">+91 94390 00123</span>
                </div>
                <a href="tel:+919439000123" className="btn-call-compact flex align-center gap-4">
                  <Icons.Phone size={10} />
                  <span>Call</span>
                </a>
              </div>

              {/* Contact 2 */}
              <div className="contact-compact-item flex justify-between align-center">
                <div className="contact-details">
                  <strong>Transport Office</strong>
                  <span className="contact-phone">+91 94390 00124</span>
                </div>
                <a href="tel:+919439000124" className="btn-call-compact flex align-center gap-4">
                  <Icons.Phone size={10} />
                  <span>Call</span>
                </a>
              </div>

              {/* Contact 3 */}
              <div className="contact-compact-item flex justify-between align-center">
                <div className="contact-details">
                  <strong>Medical Room</strong>
                  <span className="contact-phone">+91 94390 00125</span>
                </div>
                <a href="tel:+919439000125" className="btn-call-compact flex align-center gap-4">
                  <Icons.Phone size={10} />
                  <span>Call</span>
                </a>
              </div>

              {/* Contact 4 */}
              <div className="contact-compact-item flex justify-between align-center">
                <div className="contact-details">
                  <strong>Security Desk</strong>
                  <span className="contact-phone">+91 94390 00126</span>
                </div>
                <a href="tel:+919439000126" className="btn-call-compact flex align-center gap-4">
                  <Icons.Phone size={10} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: INSTITUTIONAL COMPACT HEADER & CONTENT */}
        <div className="complaints-main-content">
          
          {/* COMPACT INSTITUTIONAL HEADER */}
          <header className="complaints-header card">
            <div className="header-meta flex justify-between align-center flex-wrap gap-8">
              <div>
                <h1 className="header-title flex align-center gap-12 flex-wrap">
                  <span>Complaint Management System</span>
                  <span className="resolution-badge">⏱️ Avg. Resolution: 3.2 Days</span>
                </h1>
                <p className="header-description">
                  Report campus issues, track resolution progress, and help improve the student experience through a transparent grievance process.
                </p>
              </div>
            </div>
          </header>

          {/* ACTIVE TAB CONTENT WINDOW */}
          <div className="complaints-view-container">
            
            {/* TAB 1: RAISE COMPLAINT */}
            {activeSubTab === 'raise' && (
              <div className="raise-complaint-tab animate-slide-in">
                
                {/* Frequently Reported Issues Panel */}
                <div className="frequent-issues-card card">
                  <div className="freq-header flex align-center gap-8">
                    <Icons.AlertTriangle size={18} className="primary-icon" />
                    <h3>Frequently Reported Issues</h3>
                  </div>
                  <p className="freq-subtitle">To avoid duplicate filings, check if your issue is already reported. Upvote to add weight.</p>
                  
                  <div className="freq-issues-grid">
                    {freqIssues.map(issue => (
                      <div key={issue.id} className="freq-issue-rowcard flex align-center justify-between gap-12">
                        <div className="issue-meta">
                          <span className="issue-cat-badge">{issue.category}</span>
                          <h4>{issue.title}</h4>
                        </div>
                        <button 
                          onClick={() => handleFreqUpvote(issue.id)}
                          className={`btn-facing-upvote ${issue.upvoted ? 'voted' : ''}`}
                          disabled={issue.upvoted}
                        >
                          👍 I am facing this too (+{issue.count})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grievance Ticket Form */}
                <div className="complaint-form-container card">
                  <div className="form-header flex align-center gap-12">
                    <Icons.FileText className="primary-icon" size={22} />
                    <h2>Raise formal grievance ticket</h2>
                  </div>
                  <p className="form-subtitle">Fill in details. Administrative cells check and address tickets within 24-72 hours.</p>

                  {localStorage.getItem('gita_complaint_draft') && (
                    <div className="draft-prompt flex align-center justify-between card">
                      <span className="flex align-center gap-8">
                        <Icons.Bookmark size={16} className="accent-icon" />
                        You have a saved draft. Would you like to load it?
                      </span>
                      <button type="button" onClick={handleLoadDraft} className="btn-load-draft">Load Draft</button>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="raise-grievance-form">
                    <div className="form-group">
                      <label>Complaint Title <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="E.g., Low water pressure in Hostel Block A, 3rd floor washroom"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category <span className="req">*</span></label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-select"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority Level <span className="req">*</span></label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="form-select"
                        >
                          <option value="Low">🟢 Low Priority</option>
                          <option value="Medium">🟡 Medium Priority</option>
                          <option value="High">🔴 High Priority</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Location / Block / Room Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="E.g., Block B, Room 304 or Central Lawns"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Detailed Description <span className="req">*</span></label>
                      <textarea
                        placeholder="Provide full description of the issue. Include dates, hardware model, or room specific parameters..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        required
                        className="form-textarea"
                      />
                    </div>

                    {/* Simulated File Evidence Uploader */}
                    <div className="form-group">
                      <label>Supporting Evidence (Upload Image / Document)</label>
                      <div className="evidence-uploader flex align-center justify-between gap-12">
                        <div className="uploader-meta flex align-center gap-12">
                          <Icons.Image size={24} className="uploader-icon" />
                          <div className="uploader-text">
                            {uploadedFile ? (
                              <>
                                <span className="file-name">{uploadedFile.name}</span>
                                <span className="file-info">{uploadedFile.size} • {uploadedFile.type}</span>
                              </>
                            ) : (
                              <>
                                <span className="uploader-prompt">No file selected</span>
                                <span className="uploader-specs">Max Size: 5MB • JPG, PNG, PDF</span>
                              </>
                            )}
                          </div>
                        </div>
                        <label className="btn-file-select">
                          Browse Files
                          <input 
                            type="file" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                            accept=".jpg,.jpeg,.png,.pdf" 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Anonymous Toggle */}
                    <div className="anonymous-toggle-row flex align-center justify-between card">
                      <div className="toggle-text">
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: 'var(--text-heading)', margin: 0 }}>
                          Submit Anonymously
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Hide your student identity from public feeds. Administration cell will still resolve the ticket.
                        </span>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    {/* Form Buttons */}
                    <div className="form-actions flex gap-12 justify-end">
                      <button type="button" onClick={handleSaveDraft} className="btn-action-draft">
                        Save Draft
                      </button>
                      <button type="submit" className="btn-action-submit">
                        Submit Complaint
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: MY COMPLAINTS */}
            {activeSubTab === 'my' && (
              <div className="my-complaints-tab animate-slide-in">
                {/* Search & Filters */}
                <div className="search-filter-card card flex gap-16 align-center flex-wrap">
                  <div className="search-bar-wrap flex-1">
                    <Icons.Search size={18} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search complaints by ID, title..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input-box"
                    />
                  </div>

                  <div className="filter-select-wrap">
                    <label>Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="filter-select-wrap">
                    <label>Category:</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
                      <option value="All">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Complaints List Grid */}
                <div className="my-complaints-list-grid">
                  {filteredMyComplaints.length === 0 ? (
                    <div className="empty-statecard card text-center">
                      <Icons.CheckSquare size={48} className="empty-icon" />
                      <h3>No grievances found</h3>
                      <p>Try searching another keyword or create a new complaint ticket.</p>
                    </div>
                  ) : (
                    filteredMyComplaints.map(ticket => (
                      <div key={ticket.id} className="ticket-card card animate-slide-in">
                        
                        {/* Ticket Card Header */}
                        <div className="ticket-card-header justify-between flex align-center">
                          <div>
                            <span className="ticket-id">{ticket.id}</span>
                            <span className="ticket-category">{ticket.category}</span>
                          </div>
                          <span className={`urgency-pill ${ticket.urgency.toLowerCase()}`}>
                            {ticket.urgency} Priority
                          </span>
                        </div>

                        <h3 className="ticket-title">{ticket.title}</h3>
                        <p className="ticket-desc">{ticket.description}</p>
                        {ticket.location && ticket.location !== 'N/A' && (
                          <p className="ticket-loc">📍 <strong>Location:</strong> {ticket.location}</p>
                        )}

                        {/* Stepper progress tracker */}
                        <div className="stepper-progress-tracker-wrap">
                          <div className="stepper-track-bar">
                            <div 
                              className="stepper-progress-fill" 
                              style={{ width: `${(getStatusStepIndex(ticket.status) / 3) * 100}%` }}
                            />
                          </div>
                          <div className="stepper-steps-row flex justify-between">
                            <div className={`step-node ${getStatusStepIndex(ticket.status) >= 0 ? 'active' : ''}`}>
                              <span className="node-dot"></span>
                              <span className="node-label">Pending</span>
                            </div>
                            <div className={`step-node ${getStatusStepIndex(ticket.status) >= 1 ? 'active' : ''}`}>
                              <span className="node-dot"></span>
                              <span className="node-label">Assigned</span>
                            </div>
                            <div className={`step-node ${getStatusStepIndex(ticket.status) >= 2 ? 'active' : ''}`}>
                              <span className="node-dot"></span>
                              <span className="node-label">In Progress</span>
                            </div>
                            <div className={`step-node ${getStatusStepIndex(ticket.status) >= 3 ? 'active' : ''}`}>
                              <span className="node-dot"></span>
                              <span className="node-label">Resolved</span>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Card Footer */}
                        <div className="ticket-card-footer justify-between align-center flex flex-wrap gap-8">
                          <div className="assigned-dept-info">
                            <span>Assigned Dept:</span>
                            <strong>{ticket.assignedDept}</strong>
                          </div>
                          <div className="ticket-meta-dates">
                            <span>Last Updated: <strong>{ticket.lastUpdated}</strong></span>
                            <span className="ticket-sub-date">Filed on {ticket.date}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ANONYMOUS COMPLAINTS */}
            {activeSubTab === 'anonymous' && (
              <div className="anonymous-complaints-tab animate-slide-in">
                <div className="tab-info-card card flex align-center gap-12">
                  <Icons.Users className="primary-icon" size={24} />
                  <div>
                    <h4>Public Anonymous Grievances</h4>
                    <p>These tickets are submitted anonymously by other students. You can upvote or support if you face them.</p>
                  </div>
                </div>

                <div className="anonymous-list-grid">
                  {anonComplaints.map(anon => (
                    <div key={anon.id} className="anon-ticket-card card">
                      <div className="anon-card-header justify-between flex align-center">
                        <div className="anon-user flex align-center gap-8">
                          <div className="anon-avatar flex align-center justify-between">👤</div>
                          <div>
                            <strong>Anonymous Student</strong>
                            <span>Category: {anon.category}</span>
                          </div>
                        </div>
                        <span className="anon-date-badge">{anon.date}</span>
                      </div>

                      <h3 className="anon-title">{anon.title}</h3>
                      <p className="anon-desc">{anon.description}</p>

                      {/* Public Status tracker: Submitted -> In Review -> Action Taken */}
                      <div className="anon-status-tracker flex align-center justify-between gap-12">
                        <div className="tracker-labels flex justify-between flex-1">
                          <div className={`track-node ${getAnonStatusStepIndex(anon.status) >= 0 ? 'completed' : ''}`}>
                            <span className="track-dot"></span>
                            <span className="track-txt">Submitted</span>
                          </div>
                          <div className={`track-node ${getAnonStatusStepIndex(anon.status) >= 1 ? 'completed' : ''}`}>
                            <span className="track-dot"></span>
                            <span className="track-txt">In Review</span>
                          </div>
                          <div className={`track-node ${getAnonStatusStepIndex(anon.status) >= 2 ? 'completed' : ''}`}>
                            <span className="track-dot"></span>
                            <span className="track-txt">Action Taken</span>
                          </div>
                        </div>
                        
                        <div className="tracker-visual-bar">
                          <div className="bar-track">
                            <div 
                              className="bar-fill" 
                              style={{ width: `${(getAnonStatusStepIndex(anon.status) / 2) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer Facing Upvote */}
                      <div className="anon-footer flex align-center justify-between">
                        <span className="anon-responsible">Responsible: <strong>{anon.department}</strong></span>
                        <button 
                          onClick={() => handleAnonUpvote(anon.id)}
                          className={`btn-anon-support ${anon.upvoted ? 'supported' : ''}`}
                          disabled={anon.upvoted}
                        >
                          👍 I am facing this issue too ({anon.upvotes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWED REQUESTS */}
            {activeSubTab === 'reviewed' && (
              <div className="committee-decisions-tab animate-slide-in">
                <div className="tab-info-card card flex align-center gap-12" style={{ borderLeft: '4px solid var(--primary)' }}>
                  <Icons.Award className="primary-icon" size={24} />
                  <div>
                    <h4>Reviewed Requests & Transparency Log</h4>
                    <p>Displaying requests reviewed by administration but not approved, emphasizing transparency and institutional accountability.</p>
                  </div>
                </div>

                <div className="decisions-list-grid">
                  {committeeDecisions.map(dec => (
                    <div key={dec.id} className="decision-card card">
                      <div className="decision-card-header justify-between flex align-center">
                        <div>
                          <span className="decision-id">{dec.id}</span>
                          <span className="decision-cat">{dec.category}</span>
                        </div>
                        <span className="decision-status-pill">{dec.decision}</span>
                      </div>

                      <h3 className="decision-title">{dec.title}</h3>
                      <span className="decision-date">Reviewed on {dec.date}</span>

                      <div className="decision-justification-box">
                        <h5>Committee Decision Justification:</h5>
                        <p>{dec.justification}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: RESOLVED COMPLAINTS */}
            {activeSubTab === 'resolved' && (
              <div className="resolved-complaints-tab animate-slide-in">
                <div className="tab-info-card card flex align-center gap-12" style={{ borderLeft: '4px solid var(--success)' }}>
                  <Icons.CheckCircle className="result-icon-success" size={24} />
                  <div>
                    <h4>Resolved Grievances Database</h4>
                    <p>Verified solutions completed by various administrative cell units. Demonstrating institutional turnaround metrics.</p>
                  </div>
                </div>

                <div className="resolved-list-grid">
                  {resolvedComplaints.map(res => (
                    <div key={res.id} className="resolved-card card">
                      <div className="resolved-card-header justify-between flex align-center">
                        <div>
                          <span className="resolved-id">{res.id}</span>
                          <span className="resolved-cat">{res.category}</span>
                        </div>
                        <span className="resolved-time-metric">⏱️ Resolved in {res.resolutionTime}</span>
                      </div>

                      <h3 className="resolved-title">{res.title}</h3>
                      
                      <div className="resolved-comparison-grid">
                        <div className="comp-block before">
                          <h5>❌ BEFORE STATUS:</h5>
                          <p>{res.beforeNotes}</p>
                        </div>
                        <div className="comp-block after">
                          <h5>✔️ AFTER STATUS:</h5>
                          <p>{res.afterNotes}</p>
                        </div>
                      </div>

                      <div className="resolution-summary-box">
                        <h5>Resolution Summary:</h5>
                        <p>{res.summary}</p>
                      </div>

                      <div className="resolved-footer justify-between align-center flex flex-wrap gap-8">
                        <span className="resolved-dept">Responsible Department: <strong>{res.department}</strong></span>
                        <span className="resolved-dates">Filed {res.date} • Solved {res.resolutionDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Styled JSX Styles specifically for this service-desk grievance module */}
      <style>{`
        .complaints-management-system {
          width: 100%;
        }
        
        /* 2-column layout */
        .complaints-layout-grid {
          display: grid;
          grid-template-columns: 230px 1fr;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
        }
        
        .complaints-sidebar {
          position: sticky;
          top: 88px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        /* Vertical Tab menu navigation */
        .sidebar-nav-card {
          padding: 8px;
          background-color: var(--bg-card);
        }
        .vertical-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .vertical-nav-btn {
          width: 100%;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-main);
          background-color: transparent;
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }
        .vertical-nav-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .vertical-nav-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        /* Compact Emergency Contacts list */
        .emergency-contacts-card {
          padding: 12px;
          background-color: var(--bg-card);
        }
        .emergency-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 8px;
        }
        .urgent-color {
          color: var(--urgent);
        }
        .contacts-compact-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .contact-compact-item {
          border-bottom: 1px solid var(--border);
          padding-bottom: 6px;
          gap: 6px;
        }
        .contact-compact-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .contact-details {
          flex: 1;
        }
        .contact-details strong {
          display: block;
          font-size: 11px;
          color: var(--text-heading);
          line-height: 1.25;
        }
        .contact-phone {
          display: block;
          font-size: 9.5px;
          font-weight: 500;
          color: var(--text-muted);
          margin-top: 1px;
        }
        .btn-call-compact {
          font-size: 9.5px;
          font-weight: 700;
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid var(--border);
          color: var(--primary);
          background-color: var(--primary-light);
          white-space: nowrap;
          transition: all var(--transition-fast);
          align-self: center;
        }
        .btn-call-compact:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        /* Compact Header styling */
        .complaints-header {
          padding: 16px 20px;
          margin-bottom: 20px;
        }
        .header-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-heading);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-description {
          font-size: 13px;
          color: var(--text-main);
          margin-top: 4px;
          margin-bottom: 0;
          line-height: 1.45;
        }
        
        /* Resolution Time small Badge */
        .resolution-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--success);
          background-color: var(--success-bg);
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid rgba(22, 163, 74, 0.15);
          white-space: nowrap;
        }
        
        .tab-info-card {
          padding: 14px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          background-color: var(--bg-card);
        }
        .tab-info-card h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 2px;
          margin-top: 0;
        }
        .tab-info-card p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }
        
        /* Frequently Reported Issues styling */
        .frequent-issues-card {
          margin-bottom: 20px;
          padding: 16px;
        }
        .freq-header h3 {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        }
        .freq-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 14px;
          margin-top: 2px;
        }
        .freq-issues-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .freq-issue-rowcard {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }
        .issue-cat-badge {
          font-size: 8px;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 1px 5px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        .freq-issue-rowcard h4 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
          margin-top: 4px;
          margin-bottom: 0;
        }
        .btn-facing-upvote {
          font-size: 10px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 20px;
          border: 1px solid var(--border);
          color: var(--text-main);
          background-color: var(--bg-card);
          white-space: nowrap;
        }
        .btn-facing-upvote:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .btn-facing-upvote.voted {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
          cursor: default;
        }
        
        /* Grievance Submission Form styles */
        .complaint-form-container {
          padding: 20px;
        }
        .form-header h2 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }
        .form-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
          margin-top: 2px;
        }
        .raise-grievance-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .form-group .req {
          color: var(--urgent);
        }
        .form-input, .form-select, .form-textarea {
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13.5px;
          background-color: var(--bg-app);
          color: var(--text-heading);
          transition: border-color var(--transition-fast);
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        /* Draft prompt box */
        .draft-prompt {
          background-color: var(--accent-light);
          padding: 10px 14px;
          margin-bottom: 14px;
          font-size: 12px;
          color: var(--text-heading);
        }
        .btn-load-draft {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          text-decoration: underline;
        }
        
        /* Evidence Uploader simulation */
        .evidence-uploader {
          background-color: var(--bg-app);
          border: 1.5px dashed var(--border);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
        }
        .uploader-icon {
          color: var(--text-muted);
        }
        .uploader-text {
          display: flex;
          flex-direction: column;
        }
        .uploader-prompt {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-main);
        }
        .uploader-specs {
          font-size: 10.5px;
          color: var(--text-muted);
        }
        .file-name {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--primary);
        }
        .file-info {
          font-size: 10.5px;
          color: var(--text-muted);
        }
        .btn-file-select {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-main);
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-file-select:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        /* iOS Switch Toggle style */
        .anonymous-toggle-row {
          padding: 12px 14px;
          background-color: var(--bg-app);
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--border);
          transition: .3s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }
        input:checked + .slider {
          background-color: var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .slider.round {
          border-radius: 24px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        
        .btn-action-draft {
          border: 1.5px solid var(--border);
          color: var(--text-main);
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }
        .btn-action-draft:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        .btn-action-submit {
          background-color: var(--primary);
          color: white;
          padding: 8px 20px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }
        .btn-action-submit:hover {
          background-color: var(--primary-hover);
        }
        
        /* Search and filter bar */
        .search-filter-card {
          padding: 12px 16px;
          margin-bottom: 20px;
          background-color: var(--bg-card);
        }
        .search-bar-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .search-input-box {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 30px;
          padding: 8px 12px 8px 34px;
          font-size: 13px;
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        .search-input-box:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
        }
        .filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-main);
          font-weight: 600;
        }
        .filter-select {
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 12px;
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        
        /* Grid list and Service Ticket Cards styling */
        .my-complaints-list-grid, .anonymous-list-grid, .decisions-list-grid, .resolved-list-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ticket-card {
          padding: 16px;
          border-top: 3px solid var(--border);
        }
        .ticket-card:hover {
          border-top-color: var(--primary);
        }
        .ticket-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 11px;
          color: var(--text-muted);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          background-color: var(--bg-app);
        }
        .ticket-category {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }
        .urgency-pill {
          font-size: 8.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .urgency-pill.high { background-color: var(--urgent-bg); color: var(--urgent); }
        .urgency-pill.medium { background-color: var(--important-bg); color: var(--important); }
        .urgency-pill.low { background-color: var(--general-bg); color: var(--general); }
        
        .ticket-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-top: 10px;
          margin-bottom: 6px;
        }
        .ticket-desc {
          font-size: 13px;
          color: var(--text-main);
          line-height: 1.45;
          margin-bottom: 10px;
        }
        .ticket-loc {
          font-size: 11px;
          color: var(--text-muted);
          background-color: var(--bg-app);
          padding: 4px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 12px;
        }
        
        /* Stepper progress tracker on cards */
        .stepper-progress-tracker-wrap {
          margin: 20px 0 12px 0;
          position: relative;
        }
        .stepper-track-bar {
          height: 3px;
          background-color: var(--border);
          width: 100%;
          position: absolute;
          top: 8px;
          left: 0;
          z-index: 1;
        }
        .stepper-progress-fill {
          height: 100%;
          background-color: var(--primary);
          width: 0;
          transition: width 0.4s ease;
        }
        .stepper-steps-row {
          position: relative;
          z-index: 2;
        }
        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 70px;
          text-align: center;
        }
        .node-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--bg-card);
          border: 3px solid var(--border);
          transition: all 0.3s ease;
          display: block;
        }
        .node-label {
          font-size: 9px;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: 4px;
          text-transform: uppercase;
        }
        .step-node.active .node-dot {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }
        .step-node.active .node-label {
          color: var(--primary);
        }
        .ticket-card .step-node.active:nth-child(4) .node-dot {
          background-color: var(--success);
          border-color: var(--success);
        }
        .ticket-card .step-node.active:nth-child(4) .node-label {
          color: var(--success);
        }
        
        .ticket-card-footer {
          border-top: 1px solid var(--border);
          padding-top: 10px;
          margin-top: 12px;
          font-size: 11.5px;
        }
        .assigned-dept-info span {
          color: var(--text-muted);
          display: block;
        }
        .assigned-dept-info strong {
          color: var(--text-heading);
        }
        .ticket-meta-dates {
          text-align: right;
        }
        .ticket-meta-dates span {
          display: block;
        }
        .ticket-sub-date {
          color: var(--text-muted);
          font-size: 10px;
          margin-top: 2px;
        }
        
        /* Anonymous Tab Cards styling */
        .anon-ticket-card {
          padding: 16px;
        }
        .anon-card-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .anon-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--border);
          font-size: 12px;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anon-user strong {
          font-size: 12.5px;
          color: var(--text-heading);
          display: block;
        }
        .anon-user span {
          font-size: 10px;
          color: var(--text-muted);
          display: block;
        }
        .anon-date-badge {
          font-size: 11px;
          color: var(--text-muted);
        }
        .anon-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 4px;
        }
        .anon-desc {
          font-size: 13px;
          color: var(--text-main);
          line-height: 1.45;
          margin-bottom: 12px;
        }
        
        /* Anon public visual status tracker */
        .anon-status-tracker {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 12px;
        }
        .tracker-labels {
          display: flex;
          justify-content: space-between;
        }
        .track-node {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .track-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--border);
          display: inline-block;
        }
        .track-txt {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .track-node.completed .track-dot {
          background-color: var(--primary);
        }
        .track-node.completed .track-txt {
          color: var(--primary);
        }
        .track-node.completed:nth-child(3) .track-dot {
          background-color: var(--success);
        }
        .track-node.completed:nth-child(3) .track-txt {
          color: var(--success);
        }
        .tracker-visual-bar {
          width: 100px;
        }
        .bar-track {
          height: 4px;
          background-color: var(--border);
          border-radius: 2px;
          width: 100%;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background-color: var(--primary);
          width: 0%;
          transition: width 0.3s ease;
        }
        .track-node.completed:nth-child(3) ~ .tracker-visual-bar .bar-fill {
          background-color: var(--success);
        }
        
        .anon-footer {
          border-top: 1px solid var(--border);
          padding-top: 10px;
          font-size: 11.5px;
        }
        .anon-responsible {
          color: var(--text-muted);
        }
        .anon-responsible strong {
          color: var(--text-main);
        }
        .btn-anon-support {
          font-size: 10px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-main);
        }
        .btn-anon-support:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .btn-anon-support.supported {
          background-color: var(--success-bg);
          color: var(--success);
          border-color: var(--success);
          cursor: default;
        }
        
        /* Committee Decisions Styling */
        .decision-card {
          padding: 16px;
          border-top: 3px solid var(--primary);
        }
        .decision-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 11px;
          color: var(--text-muted);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          background-color: var(--bg-app);
        }
        .decision-cat {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }
        .decision-status-pill {
          font-size: 8.5px;
          font-weight: 700;
          background-color: var(--urgent-bg);
          color: var(--urgent);
          padding: 2px 6px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .decision-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-top: 10px;
          margin-bottom: 4px;
        }
        .decision-date {
          font-size: 11px;
          color: var(--text-muted);
          display: block;
          margin-bottom: 10px;
        }
        .decision-justification-box {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px;
        }
        .decision-justification-box h5 {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
          margin-top: 0;
        }
        .decision-justification-box p {
          font-size: 12.5px;
          color: var(--text-main);
          line-height: 1.45;
          margin: 0;
        }
        
        /* Resolved Database Cards styling */
        .resolved-card {
          padding: 16px;
          border-top: 3px solid var(--success);
        }
        .resolved-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 11px;
          color: var(--text-muted);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          background-color: var(--bg-app);
        }
        .resolved-cat {
          font-size: 9px;
          font-weight: 700;
          color: var(--success);
          background-color: var(--success-bg);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }
        .resolved-time-metric {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--success);
          background-color: var(--success-bg);
          padding: 3px 8px;
          border-radius: 20px;
        }
        .resolved-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-top: 10px;
          margin-bottom: 12px;
        }
        
        /* Before/After side comparison */
        .resolved-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .comp-block {
          padding: 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .comp-block.before {
          background-color: rgba(225, 29, 72, 0.01);
          border-left: 3px solid var(--urgent);
        }
        .comp-block.after {
          background-color: rgba(22, 163, 74, 0.01);
          border-left: 3px solid var(--success);
        }
        .comp-block h5 {
          font-size: 9.5px;
          font-weight: 700;
          margin-bottom: 2px;
          margin-top: 0;
        }
        .comp-block.before h5 { color: var(--urgent); }
        .comp-block.after h5 { color: var(--success); }
        .comp-block p {
          font-size: 12px;
          color: var(--text-main);
          line-height: 1.4;
          margin: 0;
        }
        
        .resolution-summary-box {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px;
          margin-bottom: 12px;
        }
        .resolution-summary-box h5 {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
          margin-top: 0;
        }
        .resolution-summary-box p {
          font-size: 12.5px;
          color: var(--text-main);
          line-height: 1.45;
          margin: 0;
        }
        
        .resolved-footer {
          border-top: 1px solid var(--border);
          padding-top: 10px;
          font-size: 11.5px;
        }
        .resolved-dept {
          color: var(--text-muted);
        }
        .resolved-dept strong {
          color: var(--text-main);
        }
        .resolved-dates {
          color: var(--text-muted);
        }
        
        /* Toast style */
        .toast-alert {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--text-heading);
          color: var(--bg-card);
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          z-index: 2000;
        }
        
        /* Empty states */
        .empty-statecard {
          padding: 30px;
          background-color: var(--bg-card);
        }
        .empty-statecard h3 {
          font-size: 15px;
          font-weight: 700;
          margin-top: 10px;
          margin-bottom: 4px;
        }
        .empty-statecard p {
          font-size: 12px;
          color: var(--text-muted);
        }
        .empty-icon {
          color: var(--text-muted);
        }
        
        /* Responsive Rules */
        @media (max-width: 768px) {
          .complaints-layout-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .complaints-sidebar {
            position: static;
            gap: 16px;
          }
          .vertical-nav-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .vertical-nav-btn {
            width: auto;
            white-space: nowrap;
          }
          .resolved-comparison-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

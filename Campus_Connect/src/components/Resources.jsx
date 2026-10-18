import React, { useState, useEffect } from 'react';
import * as Icons from './Icons';

export default function Resources({
  resources,
  searchQuery,
  resourceFilter,
  setResourceFilter
}) {
  const [attended, setAttended] = useState(38);
  const [total, setTotal] = useState(48);
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [downloading, setDownloading] = useState(null); // resourceId
  const [localSearch, setLocalSearch] = useState('');

  // Sync searchQuery prop changes to localSearch state
  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  // Sync tab links
  useEffect(() => {
    // Scroll to section if specified
    if (resourceFilter === 'attendance') {
      const el = document.getElementById('attendance-widget');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [resourceFilter]);

  const calculateAttendance = () => {
    if (!total || total <= 0) return 0;
    return parseFloat(((attended / total) * 100).toFixed(1));
  };

  const getRequiredClasses = () => {
    const currentPct = calculateAttendance();
    if (currentPct >= targetPercentage) return 0;
    
    // Formula: (Attended + X) / (Total + X) >= Target / 100
    // Attended + X >= (Target / 100) * (Total + X)
    // Attended + X >= (Target/100)*Total + (Target/100)*X
    // X * (1 - Target/100) >= (Target/100)*Total - Attended
    // X >= ((Target/100)*Total - Attended) / (1 - Target/100)
    const targetFraction = targetPercentage / 100;
    const numerator = targetFraction * total - attended;
    const denominator = 1 - targetFraction;
    
    if (denominator <= 0) return 0;
    return Math.max(0, Math.ceil(numerator / denominator));
  };

  const handleDownload = (id, fileName) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      try {
        const fileContent = `GITA AUTONOMOUS COLLEGE, BHUBANESWAR\nAcademic Resource Document\n\nFilename: ${fileName}\nCourse & Syllabus Reference\nDepartment: CSE / IT / ECE\nStatus: Official Institutional Material (2025-26)\n\nComplete course guidelines, recommended textbooks, and question paper solutions.`;
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Download error:', err);
      }
    }, 800);
  };

  // Filter resources based on category and search query
  const filteredResources = resources.filter((res) => {
    // Apply tab/quicklink filter
    if (resourceFilter && resourceFilter !== 'attendance') {
      if (res.category !== resourceFilter) return false;
    }
    
    const query = localSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      res.name.toLowerCase().includes(query) ||
      (res.description && res.description.toLowerCase().includes(query)) ||
      res.category.toLowerCase().includes(query)
    );
  });

  const percentage = calculateAttendance();
  const classesNeeded = getRequiredClasses();

  return (
    <div className="resources-container animate-slide-in">
      {/* Category Tabs inside Resources */}
      <div className="resources-filter-tabs flex gap-8">
        <button
          className={`filter-tab-btn ${!resourceFilter ? 'active' : ''}`}
          onClick={() => setResourceFilter('')}
        >
          All Resources
        </button>
        <button
          className={`filter-tab-btn ${resourceFilter === 'Academic File' ? 'active' : ''}`}
          onClick={() => setResourceFilter('Academic File')}
        >
          Documents & Syllabus
        </button>
        <button
          className={`filter-tab-btn ${resourceFilter === 'Academic Link' ? 'active' : ''}`}
          onClick={() => setResourceFilter('Academic Link')}
        >
          Academic Links
        </button>
        <button
          className={`filter-tab-btn ${resourceFilter === 'Student Service' ? 'active' : ''}`}
          onClick={() => setResourceFilter('Student Service')}
        >
          Student Services
        </button>
        <button
          className={`filter-tab-btn ${resourceFilter === 'attendance' ? 'active' : ''}`}
          onClick={() => setResourceFilter('attendance')}
        >
          Attendance Calculator
        </button>
      </div>

      <div className="resources-grid">
        {/* Left Side: Directory Grid */}
        <div className="resources-main-list">
          {resourceFilter !== 'attendance' && (
            <>
              {/* Local Resource Search Bar */}
              <div className="local-search-card card">
                <div className="search-wrapper">
                  <Icons.Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search documents, syllabus guides, or links..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="search-input-local"
                  />
                  {localSearch && (
                    <button className="clear-search-local" onClick={() => setLocalSearch('')}>
                      <Icons.Close size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="files-grid">
                {filteredResources.length === 0 ? (
                  <div className="empty-files card">
                    <Icons.FileText size={36} className="empty-icon" />
                    <p>No matching resources found.</p>
                  </div>
                ) : (
                filteredResources.map((res) => (
                  <div key={res.id} className="resource-file-card card">
                    <div className="resource-type-indicator justify-between flex">
                      <span className="res-category-badge">{res.category}</span>
                      {res.file && <Icons.FileText size={18} className="muted-icon" />}
                      {res.url && <Icons.ExternalLink size={18} className="muted-icon" />}
                    </div>

                    <h3 className="resource-name">{res.name}</h3>
                    <p className="resource-desc">{res.description}</p>

                    {res.file && (
                      <div className="file-info-bar justify-between align-center flex">
                        <span className="file-size-tag">{res.size}</span>
                        <button
                          onClick={() => handleDownload(res.id, res.file)}
                          disabled={downloading === res.id}
                          className="file-action-btn flex align-center gap-8"
                        >
                          {downloading === res.id ? (
                            <>
                              <span className="btn-spinner" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Icons.ArrowRight size={14} style={{ transform: 'rotate(90deg)' }} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {res.url && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="resource-external-link flex align-center gap-8"
                      >
                        <span>Open Portal</span>
                        <Icons.ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
          )}
        </div>

        {/* Right Side: Attendance Calculator (Matches quick link) */}
        {(resourceFilter === 'attendance' || !resourceFilter) && (
          <div id="attendance-widget" className="attendance-calculator-card card">
            <div className="widget-header flex align-center gap-12">
              <Icons.CheckSquare className="primary-icon" size={24} />
              <h2>Attendance Tracker</h2>
            </div>
            <p className="widget-subtitle">
              Update your class counts to verify end-semester eligibility. Cutoff requirement is <strong>75%</strong>.
            </p>

            <div className="widget-score-panel flex align-center justify-between">
              <div className="attendance-circle">
                <span className="circle-percentage">{percentage}%</span>
                <span className="circle-label">Current</span>
              </div>
              <div className="attendance-stats">
                <div className="stat-row justify-between flex">
                  <span>Attended:</span>
                  <strong>{attended}</strong>
                </div>
                <div className="stat-row justify-between flex">
                  <span>Conducted:</span>
                  <strong>{total}</strong>
                </div>
                <div className="stat-row justify-between flex">
                  <span>Min Requirement:</span>
                  <strong>75%</strong>
                </div>
              </div>
            </div>

            <div className="widget-divider" />

            <div className="calculator-inputs">
              <div className="form-group">
                <label>Classes Attended</label>
                <div className="counter-input-row flex align-center gap-12">
                  <button
                    className="calc-adjust-btn"
                    onClick={() => setAttended(Math.max(0, attended - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={attended}
                    onChange={(e) => setAttended(Math.max(0, parseInt(e.target.value) || 0))}
                    className="calc-input"
                  />
                  <button
                    className="calc-adjust-btn"
                    onClick={() => setAttended(Math.min(total, attended + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Total Classes Conducted</label>
                <div className="counter-input-row flex align-center gap-12">
                  <button
                    className="calc-adjust-btn"
                    onClick={() => setTotal(Math.max(attended, total - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(Math.max(attended, parseInt(e.target.value) || 0))}
                    className="calc-input"
                  />
                  <button className="calc-adjust-btn" onClick={() => setTotal(total + 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="widget-divider" />

            <div
              className={`calculator-result-box ${
                percentage >= 75 ? 'status-eligible' : 'status-defaulter'
              }`}
            >
              {percentage >= 75 ? (
                <div className="flex gap-12">
                  <Icons.CheckCircle size={20} className="result-icon-success" />
                  <div>
                    <h5>Status: Eligible</h5>
                    <p>Great! You are currently meeting the attendance criteria.</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-12">
                  <Icons.AlertTriangle size={20} className="result-icon-danger" />
                  <div>
                    <h5>Status: Shortage Alert</h5>
                    <p>
                      You need to attend <strong>{classesNeeded}</strong> more consecutive classes to
                      cross the 75% target!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .resources-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .resources-filter-tabs {
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 8px;
          overflow-x: auto;
        }
        .filter-tab-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 30px;
          color: var(--text-main);
          border: 1px solid var(--border);
          white-space: nowrap;
        }
        .filter-tab-btn:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .filter-tab-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .resources-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        .resources-main-list {
          flex: 1;
        }
        
        .files-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .resource-file-card {
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
        }
        .res-category-badge {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .muted-icon {
          color: var(--text-muted);
        }
        
        .resource-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-top: 12px;
          margin-bottom: 6px;
        }
        .resource-desc {
          font-size: 12.5px;
          color: var(--text-main);
          line-height: 1.45;
          flex: 1;
          margin-bottom: 16px;
        }
        .file-info-bar {
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
        .file-size-tag {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .file-action-btn {
          color: var(--primary);
          font-size: 12px;
          font-weight: 600;
        }
        .file-action-btn:hover {
          color: var(--primary-hover);
        }
        .btn-spinner {
          width: 12px;
          height: 12px;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        .resource-external-link {
          border-top: 1px solid var(--border);
          padding-top: 12px;
          justify-content: flex-end;
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
        }
        .resource-external-link:hover {
          color: #92400E;
        }
        
        .empty-files {
          grid-column: 1 / span 2;
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
        }
        
        /* Attendance Calculator Card */
        .attendance-calculator-card {
          align-self: flex-start;
          position: sticky;
          top: 88px;
        }
        .widget-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .widget-score-panel {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 16px;
        }
        .attendance-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: var(--bg-card);
          border: 4px solid var(--primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .circle-percentage {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
        }
        .circle-label {
          font-size: 8px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .attendance-stats {
          flex: 1;
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-row {
          font-size: 12.5px;
          color: var(--text-main);
        }
        .widget-divider {
          height: 1px;
          background-color: var(--border);
          margin: 16px 0;
        }
        
        .calculator-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .counter-input-row {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px;
          justify-content: space-between;
        }
        .calc-adjust-btn {
          width: 28px;
          height: 28px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-heading);
        }
        .calc-adjust-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        .calc-input {
          border: none;
          background: transparent;
          text-align: center;
          width: 50px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .calculator-result-box {
          border-radius: var(--radius-sm);
          padding: 12px 14px;
        }
        .calculator-result-box.status-eligible {
          background-color: var(--success-bg);
          border-left: 4px solid var(--success);
        }
        .calculator-result-box.status-eligible h5 {
          color: var(--success);
          font-weight: 700;
        }
        .calculator-result-box.status-defaulter {
          background-color: var(--urgent-bg);
          border-left: 4px solid var(--urgent);
        }
        .calculator-result-box.status-defaulter h5 {
          color: var(--urgent);
          font-weight: 700;
        }
        .calculator-result-box p {
          font-size: 11.5px;
          color: var(--text-main);
          margin-top: 2px;
        }
        
        .result-icon-success { color: var(--success); }
        .result-icon-danger { color: var(--urgent); }
        
        /* Local Search Styles */
        .local-search-card {
          padding: 12px;
          margin-bottom: 16px;
        }
        .local-search-card .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .local-search-card .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input-local {
          width: 100%;
          padding: 10px 14px 10px 38px;
          font-size: 14px;
          border: 1px solid var(--border);
          border-radius: 30px;
          background-color: var(--bg-app);
          color: var(--text-heading);
          transition: all var(--transition-normal);
        }
        .search-input-local:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(122, 26, 34, 0.08);
          background-color: var(--bg-card);
        }
        .clear-search-local {
          position: absolute;
          right: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .clear-search-local:hover {
          color: var(--text-heading);
        }

        @media (max-width: 1024px) {
          .resources-grid {
            grid-template-columns: 1fr;
          }
          .attendance-calculator-card {
            position: static;
            width: 100%;
          }
          .files-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

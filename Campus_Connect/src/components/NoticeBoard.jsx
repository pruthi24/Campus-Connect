import React, { useState } from 'react';
import * as Icons from './Icons';

export default function NoticeBoard({ notices, viewNotice, onViewAll }) {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    viewNotice(notice.id); // Triggers parent views-count increment
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!selectedNotice?.attachment) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      try {
        const docText = `GITA AUTONOMOUS COLLEGE, BHUBANESWAR\nOfficial Campus Notice Attachment\n\nTitle: ${selectedNotice.title}\nCategory: ${selectedNotice.type}\nPublished: ${selectedNotice.time}\n\n${selectedNotice.content}\n\nAuthorized by: Academic & Administrative Directorate, GITA Autonomous College`;
        const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedNotice.attachment;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Download error:', err);
      }
    }, 800);
  };

  return (
    <section className="notice-board-section card">
      <div className="section-header justify-between align-center flex">
        <div className="section-title flex align-center gap-8">
          <Icons.Megaphone className="primary-icon" size={22} />
          <h2>Notice Board</h2>
        </div>
        <button onClick={onViewAll} className="view-all-link flex align-center gap-8">
          <span>VIEW ALL</span>
          <Icons.ArrowRight size={16} />
        </button>
      </div>

      <div className="notice-cards-grid">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="notice-card"
            style={{ borderLeftColor: notice.color }}
            onClick={() => handleNoticeClick(notice)}
          >
            <div className="notice-card-header justify-between align-center flex">
              <span
                className={`notice-badge`}
                style={{
                  color: notice.color,
                  backgroundColor: notice.color + '10' // 10% opacity hex
                }}
              >
                {notice.type}
              </span>
              <span className="notice-time">{notice.time}</span>
            </div>
            <h3 className="notice-title">{notice.title}</h3>
            <p className="notice-snippet">
              {notice.content.length > 80
                ? notice.content.substring(0, 80) + '...'
                : notice.content}
            </p>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="modal-backdrop" onClick={() => setSelectedNotice(null)}>
          <div className="modal-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNotice(null)}>
              <Icons.Close size={20} />
            </button>
            <div className="modal-header">
              <span
                className="modal-badge"
                style={{
                  color: selectedNotice.color,
                  backgroundColor: selectedNotice.color + '10'
                }}
              >
                {selectedNotice.type}
              </span>
              <span className="modal-time-detail flex align-center gap-8">
                <Icons.Calendar size={14} />
                Posted {selectedNotice.time}
              </span>
            </div>
            <h2 className="modal-notice-title">{selectedNotice.title}</h2>
            <div className="modal-body-scroll">
              <p className="modal-notice-text">{selectedNotice.content}</p>
              
              {selectedNotice.attachment && (
                <div className="attachment-box justify-between align-center flex">
                  <div className="flex align-center gap-12">
                    <Icons.FileText className="attachment-icon" size={24} />
                    <div>
                      <span className="attachment-name">{selectedNotice.attachment}</span>
                      <span className="attachment-size">PDF Document • 1.2 MB</span>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className={`download-btn flex align-center gap-8 ${
                      downloading ? 'downloading' : ''
                    }`}
                  >
                    {downloading ? (
                      <>
                        <span className="spinner" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Plus size={16} style={{ transform: 'rotate(180deg)' }} />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer justify-between align-center flex">
              <span className="notice-views-count">
                Views: <strong>{selectedNotice.views + 1}</strong>
              </span>
              <button className="btn-secondary" onClick={() => setSelectedNotice(null)}>
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .notice-board-section {
          padding: 32px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-md);
        }
        [data-theme='dark'] .notice-board-section {
          background: rgba(21, 28, 44, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .section-header {
          margin-bottom: 20px;
        }
        .section-title h2 {
          font-size: 20px;
          font-weight: 700;
        }
        .primary-icon {
          color: var(--primary);
        }
        .view-all-link {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.8px;
        }
        .view-all-link:hover {
          color: var(--primary-hover);
          transform: translateX(3px);
        }
        .notice-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .notice-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 4px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .notice-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-focus);
          background-color: var(--bg-card);
        }
        .notice-card-header {
          margin-bottom: 10px;
        }
        .notice-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .notice-time {
          font-size: 11px;
          color: var(--text-muted);
        }
        .notice-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-heading);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .notice-snippet {
          font-size: 12px;
          color: var(--text-main);
          line-height: 1.4;
        }
        
        /* Modal Backdrop */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .modal-content {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 550px;
          width: 100%;
          padding: 28px;
          position: relative;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--text-muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-close:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .modal-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .modal-time-detail {
          font-size: 12px;
          color: var(--text-muted);
        }
        .modal-notice-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 16px;
          line-height: 1.25;
        }
        .modal-body-scroll {
          overflow-y: auto;
          flex: 1;
          margin-bottom: 24px;
        }
        .modal-notice-text {
          font-size: 14px;
          color: var(--text-main);
          line-height: 1.6;
          white-space: pre-wrap;
          margin-bottom: 24px;
        }
        .attachment-box {
          border: 1px solid var(--border);
          background-color: var(--bg-app);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .attachment-icon {
          color: var(--primary);
        }
        .attachment-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
          display: block;
        }
        .attachment-size {
          font-size: 11px;
          color: var(--text-muted);
        }
        .download-btn {
          background-color: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
        }
        .download-btn:hover {
          background-color: var(--primary-hover);
        }
        .download-btn.downloading {
          background-color: var(--border-focus);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: var(--text-main);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .modal-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .btn-secondary {
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
        }
        .btn-secondary:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        .notice-views-count {
          font-size: 12px;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .notice-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

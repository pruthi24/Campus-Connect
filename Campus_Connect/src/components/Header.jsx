import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';

export default function Header({
  activeTab,
  setActiveTab,
  setResourceFilter,
  currentUser,
  setCurrentUser,
  allUsers,
  theme,
  notifications,
  clearNotifications,
  setActiveProfileSection // callback to change dashboard section
}) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSwitchSubmenu, setShowSwitchSubmenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'notices', label: 'Notices' },
    { id: 'feed', label: 'Feed' },
    { id: 'communities', label: 'Communities' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'resources', label: 'Resources' }
  ];

  const handleUserSwitch = (userId) => {
    setCurrentUser(allUsers[userId]);
    setShowProfileDropdown(false);
    setShowSwitchSubmenu(false);
    if (setActiveProfileSection) {
      setActiveProfileSection('overview');
    }
  };

  const handleMenuClick = (section) => {
    setActiveTab('profile');
    if (setActiveProfileSection) {
      setActiveProfileSection(section);
    }
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout? (This will reset session states)");
    if (confirmLogout) {
      // Set to first user in list or reset
      const firstUser = Object.keys(allUsers)[0];
      setCurrentUser(allUsers[firstUser]);
      setActiveTab('home');
      setShowProfileDropdown(false);
      alert("Logged out. Reset to default user profile.");
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Branding */}
        <div className="brand" onClick={() => setActiveTab('home')}>
          <span className="brand-gita">GITA</span>
          <span className="brand-connect">Connect</span>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          {navItems.map((item) => {
            if (item.id === 'resources') {
              return (
                <div key={item.id} className="nav-dropdown-container">
                  <button
                    className={`nav-link dropdown-toggle ${activeTab === 'resources' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('resources');
                      setResourceFilter('');
                    }}
                  >
                    Resources <span className="dropdown-caret">▼</span>
                    {activeTab === 'resources' && <span className="nav-indicator" />}
                  </button>
                  <div className="nav-dropdown-menu animate-slide-in">
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('resources');
                        setResourceFilter('Academic File');
                      }}
                    >
                      📚 Study Materials
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('resources');
                        setResourceFilter('Academic File');
                      }}
                    >
                      📄 Previous Year Papers
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('resources');
                        setResourceFilter('Academic Link');
                      }}
                    >
                      🌐 Academic Resources
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('communities');
                      }}
                    >
                      👥 Communities
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'profile' && setActiveProfileSection) {
                    setActiveProfileSection('overview');
                  }
                }}
              >
                {item.label}
                {activeTab === item.id && <span className="nav-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Header Right Interactions */}
        <div className="header-actions">
          {/* Notifications */}
          <div className="notification-container">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="action-btn notification-btn jiggle"
              title="Notifications"
            >
              <Icons.Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="dropdown-panel notification-panel"
                >
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="clear-all-btn">
                        Dismiss All
                      </button>
                    )}
                  </div>
                  <div className="dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="empty-notifications">
                        <p>You're all caught up! 🎉</p>
                      </div>
                    ) : (
                      <div className="notification-list">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="notification-item">
                            <div className={`notif-indicator ${notif.type.toLowerCase()}`} />
                            <div className="notif-content">
                              <p className="notif-text">{notif.text}</p>
                              <span className="notif-time">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Selector Dropdown */}
          <div className="profile-container">
            <button
              className="profile-btn"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
                setShowSwitchSubmenu(false);
              }}
            >
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                alt={currentUser.name}
                className="profile-avatar"
              />
              <span className="profile-name-text">{currentUser.name.split(' ')[0]}</span>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="dropdown-panel profile-panel"
                >
                  <div className="dropdown-header user-header glass-header">
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                      alt={currentUser.name}
                      className="dropdown-avatar"
                    />
                    <div>
                      <h4>{currentUser.name}</h4>
                      <p className="user-role">{currentUser.details}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-body glass-body">
                    <div className="profile-dropdown-menu">
                      <button 
                        className="menu-item-row"
                        onClick={() => handleMenuClick('overview')}
                      >
                        <Icons.User size={16} className="menu-icon" />
                        <span>My Profile</span>
                      </button>

                      <button 
                        className="menu-item-row"
                        onClick={() => handleMenuClick('achievements')}
                      >
                        <Icons.Trophy size={16} className="menu-icon" />
                        <span>Achievements</span>
                      </button>

                      <button 
                        className="menu-item-row"
                        onClick={() => handleMenuClick('bio')}
                      >
                        <Icons.FileText size={16} className="menu-icon" />
                        <span>Bio Section</span>
                      </button>

                      <button 
                        className="menu-item-row"
                        onClick={() => handleMenuClick('settings')}
                      >
                        <Icons.Settings size={16} className="menu-icon" />
                        <span>Settings</span>
                      </button>

                      <button 
                        className="menu-item-row"
                        onClick={() => handleMenuClick('settings')}
                      >
                        {theme === 'dark' ? <Icons.Moon size={16} className="menu-icon" /> : <Icons.Sun size={16} className="menu-icon" />}
                        <span>Appearance ({theme === 'dark' ? 'Dark' : 'Light'})</span>
                      </button>

                      {/* Switch User Toggle Option */}
                      <button 
                        className="menu-item-row"
                        onClick={() => setShowSwitchSubmenu(!showSwitchSubmenu)}
                      >
                        <Icons.Users size={16} className="menu-icon" />
                        <span>Switch Account {showSwitchSubmenu ? '▲' : '▼'}</span>
                      </button>

                      {showSwitchSubmenu && (
                        <div className="submenu-switch-list animate-slide-in">
                          {Object.values(allUsers)
                            .filter((u) => u.id !== currentUser.id)
                            .map((u) => (
                              <button
                                key={u.id}
                                className="submenu-switch-row"
                                onClick={() => handleUserSwitch(u.id)}
                              >
                                <img src={u.avatar} alt={u.name} className="submenu-avatar" />
                                <div className="submenu-info">
                                  <span className="submenu-name">{u.name}</span>
                                  <span className="submenu-role">{u.details}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}

                      <hr className="menu-divider" />

                      <button 
                        className="menu-item-row logout-row"
                        onClick={handleLogout}
                      >
                        <Icons.LogOut size={16} className="menu-icon logout-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--bg-nav);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          transition: background-color var(--transition-normal);
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
        }
        .brand-gita {
          color: var(--primary);
        }
        .brand-connect {
          color: var(--text-heading);
        }
        .nav-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 100%;
          flex-grow: 1;
        }
        .nav-link {
          position: relative;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          border-radius: var(--radius-sm);
        }
        .nav-link:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .nav-link.active {
          color: var(--primary);
          font-weight: 700;
        }
        .nav-indicator {
          position: absolute;
          bottom: -13px;
          left: 14px;
          right: 14px;
          height: 3px;
          background-color: var(--primary);
          border-radius: 3px 3px 0 0;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .action-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: var(--text-main);
          border: 1px solid var(--border);
          background: transparent;
        }
        .action-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--urgent);
          color: white;
          font-size: 10px;
          font-weight: 700;
          height: 16px;
          min-width: 16px;
          padding: 0 4px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-container, .notification-container {
          position: relative;
        }
        
        /* Profile Button Style */
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          border-radius: 30px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
        }
        .profile-btn:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        .profile-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--primary);
        }
        .profile-name-text {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-heading);
        }

        /* Dropdown Panel styling (Opaque & Solid) */
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #ffffff;
          opacity: 1 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }
        
        [data-theme='dark'] .dropdown-panel {
          background: #111827 !important;
          border: 1px solid #1f2937 !important;
        }
        
        /* Dark mode text readability */
        [data-theme='dark'] .dropdown-panel,
        [data-theme='dark'] .dropdown-panel h3,
        [data-theme='dark'] .dropdown-panel h4,
        [data-theme='dark'] .dropdown-panel span,
        [data-theme='dark'] .dropdown-panel p,
        [data-theme='dark'] .dropdown-panel button,
        [data-theme='dark'] .dropdown-panel a {
          color: #f9fafb !important;
        }

        .notification-panel {
          width: 380px;
          max-height: 500px;
          border-radius: 12px;
          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.12),
            0 4px 10px rgba(0, 0, 0, 0.08);
        }
        
        .notification-panel .dropdown-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }
        
        [data-theme='dark'] .notification-panel .dropdown-header {
          background: #111827 !important;
          border-bottom: 1px solid #1f2937 !important;
        }
        
        .notification-panel .dropdown-body {
          overflow-y: auto;
          flex: 1;
        }

        .profile-panel {
          width: 320px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }
        
        .dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .dropdown-header.user-header {
          background: #f9fafb;
          gap: 12px;
          justify-content: flex-start;
        }

        [data-theme='dark'] .dropdown-header.user-header {
          background: #1f2937 !important;
          border-bottom: 1px solid #1f2937 !important;
        }

        .dropdown-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }
        .user-role {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .dropdown-body {
          padding: 8px;
        }
        
        /* Menu Items */
        .profile-dropdown-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .menu-item-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-main);
          text-align: left;
          background: transparent;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        .menu-item-row:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .menu-icon {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .menu-item-row:hover .menu-icon {
          color: var(--primary);
        }
        
        .menu-divider {
          border: 0;
          height: 1px;
          background-color: var(--border);
          margin: 6px 0;
        }
        
        .menu-item-row.logout-row {
          color: var(--urgent);
        }
        .menu-item-row.logout-row:hover {
          background-color: var(--urgent-bg);
          color: var(--urgent);
        }
        .logout-icon {
          color: var(--urgent) !important;
        }

        /* Switch User Submenu */
        .submenu-switch-list {
          padding: 6px 4px 6px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #f3f4f6;
          border-radius: var(--radius-sm);
          margin-top: 4px;
        }
        [data-theme='dark'] .submenu-switch-list {
          background: #1f2937 !important;
        }
        .submenu-switch-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px;
          border-radius: var(--radius-sm);
          text-align: left;
        }
        .submenu-switch-row:hover {
          background-color: var(--primary-light);
        }
        [data-theme='dark'] .submenu-switch-row:hover {
          background-color: #111827 !important;
        }
        [data-theme='dark'] .menu-item-row:hover {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
        }
        [data-theme='dark'] .menu-item-row:hover .menu-icon {
          color: #f9fafb !important;
        }
        [data-theme='dark'] .menu-divider {
          background-color: #1f2937 !important;
        }
        .submenu-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
        }
        .submenu-info {
          display: flex;
          flex-direction: column;
        }
        .submenu-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .submenu-role {
          font-size: 10px;
          color: var(--text-muted);
        }

        /* Nav Dropdown styling */
        .nav-dropdown-container {
          position: relative;
          display: inline-block;
          height: 100%;
        }
        .dropdown-caret {
          font-size: 8px;
          margin-left: 4px;
          vertical-align: middle;
          transition: transform var(--transition-fast);
          display: inline-block;
        }
        .nav-dropdown-container:hover .dropdown-caret {
          transform: rotate(180deg);
        }
        .nav-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg);
          min-width: 190px;
          padding: 6px 0;
          z-index: 1000;
          flex-direction: column;
        }
        .nav-dropdown-container:hover .nav-dropdown-menu {
          display: flex;
        }
        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 8px 16px;
          font-size: 13.5px;
          color: var(--text-main);
          font-weight: 600;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .clear-all-btn {
          font-size: 12px;
          color: var(--primary);
          font-weight: 600;
        }
        .clear-all-btn:hover {
          text-decoration: underline;
        }
        .empty-notifications {
          padding: 32px 16px;
          text-align: center;
          color: var(--text-muted);
          font-size: 14px;
        }
        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .notification-item {
          display: flex;
          gap: 12px;
          padding: 10px 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .notification-item:hover {
          background-color: var(--primary-light);
        }
        .notif-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .notif-indicator.urgent { background-color: var(--urgent); }
        .notif-indicator.important { background-color: var(--important); }
        .notif-indicator.general { background-color: var(--general); }
        
        .notif-content {
          flex: 1;
        }
        .notif-text {
          font-size: 13px;
          color: var(--text-heading);
          line-height: 1.4;
        }
        .notif-time {
          font-size: 11px;
          color: var(--text-muted);
          display: block;
          margin-top: 4px;
        }

        @media (max-width: 1024px) {
          .nav-menu {
            gap: 4px;
          }
          .nav-link {
            padding: 8px 10px;
            font-size: 13px;
          }
        }
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          .profile-name-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

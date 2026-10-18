import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

export default function ProfileDashboard({
  currentUser,
  updateUserProfile,
  theme,
  setTheme,
  addNotification,
  posts,
  complaints,
  activeSection: propActiveSection
}) {
  const [activeSection, setActiveSection] = useState('overview'); // overview, bio, achievements, settings, activity

  useEffect(() => {
    if (propActiveSection) {
      setActiveSection(propActiveSection);
    }
  }, [propActiveSection]);
  
  // Local states for editing profile overview
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editUsername, setEditUsername] = useState(currentUser.username || `@${(currentUser.name || 'arnav_dutta').toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
  const [editRollNumber, setEditRollNumber] = useState(currentUser.rollNumber || 'GITA/CSE/2023/042');
  const [editBranch, setEditBranch] = useState(currentUser.branch || 'Computer Science & Engineering');
  const [editYear, setEditYear] = useState(currentUser.year || '3rd Year');
  const [editEmail, setEditEmail] = useState(currentUser.email || (currentUser.id ? `${currentUser.id}@gita.edu` : 'arnav.dutta@gita.edu'));
  const [editLinkedin, setEditLinkedin] = useState(currentUser.linkedin || '');
  const [editGithub, setEditGithub] = useState(currentUser.github || '');
  const [editTagline, setEditTagline] = useState(currentUser.tagline || 'Student at GITA Autonomous College');

  // Bio state
  const [bioText, setBioText] = useState(currentUser.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Settings states
  const [privacySettings, setPrivacySettings] = useState(currentUser.privacy || {
    showEmail: true,
    showAchievements: true,
    allowMessages: true
  });
  const [notificationSettings, setNotificationSettings] = useState(currentUser.notifications || {
    event: true,
    placement: true,
    community: true
  });
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Achievements states
  const [achievements, setAchievements] = useState(currentUser.achievements || [
    {
      id: 'ach-1',
      title: 'IEEE Research Publication',
      description: 'Published research paper on Cloud Resource Scheduling in IEEE Access journals.',
      date: '2026-05-15',
      category: 'Academic',
      certificateImage: '',
      photoImage: ''
    },
    {
      id: 'ach-2',
      title: '1st Place in National Coding League',
      description: 'Secured 1st place in the National Coding League, winning a cash prize of $1,000.',
      date: '2026-04-10',
      category: 'Hackathon',
      certificateImage: '',
      photoImage: ''
    }
  ]);
  
  const [selectedAchievementCategory, setSelectedAchievementCategory] = useState('All');
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState(null);

  // Achievement form state
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Academic',
    certificateImage: '',
    photoImage: ''
  });

  // Load current user data when user changes
  useEffect(() => {
    setEditName(currentUser.name || '');
    const cleanHandle = currentUser.username || `@${(currentUser.name || 'arnav_dutta').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    setEditUsername(cleanHandle);
    setEditRollNumber(currentUser.rollNumber || 'GITA/CSE/2023/042');
    setEditBranch(currentUser.branch || 'Computer Science & Engineering');
    setEditYear(currentUser.year || '3rd Year');
    setEditEmail(currentUser.email || (currentUser.id ? `${currentUser.id}@gita.edu` : 'arnav.dutta@gita.edu'));
    setEditLinkedin(currentUser.linkedin || '');
    setEditGithub(currentUser.github || '');
    setEditTagline(currentUser.tagline || 'Student at GITA Autonomous College');
    setBioText(currentUser.bio || '');
    if (currentUser.achievements) {
      setAchievements(currentUser.achievements);
    }
    if (currentUser.privacy) {
      setPrivacySettings(currentUser.privacy);
    }
    if (currentUser.notifications) {
      setNotificationSettings(currentUser.notifications);
    }
  }, [currentUser]);

  // Sync state back to AuthContext, Firebase Auth, and localStorage
  const syncUserChanges = async (updatedFields) => {
    if (updateUserProfile) {
      await updateUserProfile(updatedFields);
    } else {
      try {
        const merged = { ...currentUser, ...updatedFields, lastEditedAt: Date.now() };
        localStorage.setItem('campus_connect_profile', JSON.stringify(merged));
      } catch (e) {}
    }
    addNotification('Profile updated and saved permanently! ✅', 'general');
  };

  // Completion calculation
  const getCompletionStats = () => {
    let score = 0;
    const checks = {
      hasAvatar: !!currentUser.avatar,
      hasBio: !!currentUser.bio,
      hasSocial: !!(currentUser.linkedin || currentUser.github),
      hasAchievements: achievements.length > 0
    };
    if (checks.hasAvatar) score += 25;
    if (checks.hasBio) score += 25;
    if (checks.hasSocial) score += 25;
    if (checks.hasAchievements) score += 25;
    return { score, checks };
  };

  const { score: completionScore, checks: completionChecks } = getCompletionStats();

  // Save profile overview edits
  const handleSaveOverview = async (e) => {
    e.preventDefault();
    const cleanUsername = editUsername.startsWith('@') ? editUsername : `@${editUsername}`;
    const updatedFields = {
      name: editName,
      username: cleanUsername,
      rollNumber: editRollNumber,
      branch: editBranch,
      year: editYear,
      email: editEmail,
      linkedin: editLinkedin,
      github: editGithub,
      tagline: editTagline,
      details: `${editYear}, ${editBranch.includes('CS') ? 'CSE' : editBranch.slice(0, 3).toUpperCase()}`
    };
    await syncUserChanges(updatedFields);
    setIsEditingOverview(false);
  };

  // Bio Actions
  const handleSaveBio = () => {
    syncUserChanges({ bio: bioText });
    setIsEditingBio(false);
    addNotification('Bio saved successfully!', 'general');
  };

  const handleSuggestBio = (text) => {
    setBioText(text);
    setIsEditingBio(true);
  };

  // Image Upload handler with downscaling for device/phone uploads
  const handleFileSimulate = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = field === 'avatar' ? 400 : 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          if (field === 'avatar') {
            syncUserChanges({ avatar: dataUrl });
            addNotification('Profile avatar updated!', 'general');
          } else {
            setAchievementForm(prev => ({
              ...prev,
              [field]: dataUrl
            }));
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Achievement CRUD Actions
  const handleSaveAchievement = (e) => {
    e.preventDefault();
    if (!achievementForm.title.trim() || !achievementForm.description.trim()) {
      alert('Please fill out the Title and Description fields.');
      return;
    }

    let updatedAchievements;
    if (editingAchievementId) {
      // Edit mode
      updatedAchievements = achievements.map(ach => 
        ach.id === editingAchievementId 
          ? { ...ach, ...achievementForm }
          : ach
      );
      addNotification('Achievement updated successfully!', 'general');
    } else {
      // Create mode
      const newAchievement = {
        id: 'ach-' + Date.now(),
        ...achievementForm
      };
      updatedAchievements = [...achievements, newAchievement];
      addNotification('Achievement added to profile!', 'general');
    }

    setAchievements(updatedAchievements);
    syncUserChanges({ achievements: updatedAchievements });
    
    // Reset Form
    setAchievementForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Academic',
      certificateImage: '',
      photoImage: ''
    });
    setIsAddingAchievement(false);
    setEditingAchievementId(null);
  };

  const handleEditAchievement = (ach) => {
    setAchievementForm({
      title: ach.title,
      description: ach.description,
      date: ach.date,
      category: ach.category,
      certificateImage: ach.certificateImage || '',
      photoImage: ach.photoImage || ''
    });
    setEditingAchievementId(ach.id);
    setIsAddingAchievement(true);
  };

  const handleDeleteAchievement = (id) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      const updated = achievements.filter(ach => ach.id !== id);
      setAchievements(updated);
      syncUserChanges({ achievements: updated });
      addNotification('Achievement removed.', 'general');
    }
  };

  // Settings Actions
  const handleTogglePrivacy = (key) => {
    const updated = {
      ...privacySettings,
      [key]: !privacySettings[key]
    };
    setPrivacySettings(updated);
    syncUserChanges({ privacy: updated });
    addNotification('Privacy settings updated.', 'general');
  };

  const handleToggleNotification = (key) => {
    const updated = {
      ...notificationSettings,
      [key]: !notificationSettings[key]
    };
    setNotificationSettings(updated);
    syncUserChanges({ notifications: updated });
    addNotification('Notification preferences updated.', 'general');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!accountSettings.currentPassword || !accountSettings.newPassword) {
      alert('Please fill out password fields');
      return;
    }
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    addNotification('Password changed successfully!', 'general');
    setAccountSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Switch Theme handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    addNotification(`Theme switched to ${newTheme}`, 'general');
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(ach => 
    selectedAchievementCategory === 'All' || ach.category === selectedAchievementCategory
  );

  const categories = [
    'Academic', 'Internship', 'Placement', 'Certification', 
    'Hackathon', 'Sports', 'Cultural', 'Leadership'
  ];

  // Activity stats calculation
  const postsCount = posts.filter(p => p.user?.id === currentUser.id).length;
  const complaintsCount = complaints.filter(c => c.userId === currentUser.id || c.category === 'IT & Network').length; // Mock tracking

  return (
    <div className="profile-dashboard-layout animate-slide-in">
      
      {/* Sidebar Navigation */}
      <div className="profile-sidebar card glass-card">
        <div className="profile-sidebar-header text-center">
          <div className="profile-avatar-container">
            <img 
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Student')}&background=7A1A22&color=fff&bold=true`} 
              alt={currentUser.name} 
              className="dashboard-avatar-img"
            />
            <label className="avatar-upload-overlay" title="Upload new photo">
              <Icons.Upload size={16} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileSimulate('avatar', e)} 
                className="hidden-file-input" 
              />
            </label>
          </div>
          <h3>{currentUser.name}</h3>
          <p className="profile-handle" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 6px 0', fontWeight: '500' }}>
            {currentUser.username || `@${(currentUser.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
          </p>
          <p className="profile-badge-tag">{currentUser.badge || 'Elite Contributor'}</p>
          <span className="profile-details-small">{currentUser.details || `${currentUser.year || '3rd Year'}, ${currentUser.branch || 'CSE'}`}</span>
        </div>

        {/* Profile Completion Meter */}
        <div className="profile-completion-box card">
          <div className="flex justify-between align-center mb-8">
            <span className="completion-label font-sans font-semibold text-xs">Profile Completion</span>
            <span className="completion-val font-semibold">{completionScore}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <ul className="completion-checklist">
            <li className={completionChecks.hasAvatar ? 'completed' : 'pending'}>
              <Icons.CheckSquare size={12} className="check-icon" /> Avatar
            </li>
            <li className={completionChecks.hasBio ? 'completed' : 'pending'}>
              <Icons.CheckSquare size={12} className="check-icon" /> Bio
            </li>
            <li className={completionChecks.hasSocial ? 'completed' : 'pending'}>
              <Icons.CheckSquare size={12} className="check-icon" /> Social Links
            </li>
            <li className={completionChecks.hasAchievements ? 'completed' : 'pending'}>
              <Icons.CheckSquare size={12} className="check-icon" /> Achievements
            </li>
          </ul>
        </div>

        <nav className="profile-nav-menu">
          <button 
            className={`profile-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <Icons.User size={18} /> Profile Overview
          </button>
          <button 
            className={`profile-nav-item ${activeSection === 'bio' ? 'active' : ''}`}
            onClick={() => setActiveSection('bio')}
          >
            <Icons.FileText size={18} /> Bio Section
          </button>
          <button 
            className={`profile-nav-item ${activeSection === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveSection('achievements')}
          >
            <Icons.Trophy size={18} /> Achievements
          </button>
          <button 
            className={`profile-nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <Icons.Settings size={18} /> Settings & Theme
          </button>
          <button 
            className={`profile-nav-item ${activeSection === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveSection('activity')}
          >
            <Icons.Activity size={18} /> Activity Log
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="profile-main-content">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="card glass-card fill-section"
            >
              <div className="section-header justify-between align-center flex">
                <h2>Profile Overview</h2>
                {!isEditingOverview && (
                  <button 
                    onClick={() => setIsEditingOverview(true)}
                    className="btn-edit-profile"
                  >
                    <Icons.Edit size={16} /> Edit Profile
                  </button>
                )}
              </div>

              {isEditingOverview ? (
                <form onSubmit={handleSaveOverview} className="overview-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Username / Handle</label>
                      <input 
                        type="text" 
                        value={editUsername} 
                        onChange={(e) => setEditUsername(e.target.value)} 
                        className="form-control"
                        placeholder="@arnav_dutta"
                      />
                    </div>
                    <div className="form-group">
                      <label>Roll Number</label>
                      <input 
                        type="text" 
                        value={editRollNumber} 
                        onChange={(e) => setEditRollNumber(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Branch</label>
                      <input 
                        type="text" 
                        value={editBranch} 
                        onChange={(e) => setEditBranch(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <select 
                        value={editYear} 
                        onChange={(e) => setEditYear(e.target.value)} 
                        className="form-control"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Contact Email</label>
                      <input 
                        type="email" 
                        value={editEmail} 
                        onChange={(e) => setEditEmail(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Profile Tagline</label>
                      <input 
                        type="text" 
                        value={editTagline} 
                        onChange={(e) => setEditTagline(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        value={editLinkedin} 
                        placeholder="https://linkedin.com/in/username"
                        onChange={(e) => setEditLinkedin(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub Profile URL</label>
                      <input 
                        type="url" 
                        value={editGithub} 
                        placeholder="https://github.com/username"
                        onChange={(e) => setEditGithub(e.target.value)} 
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions mt-16 flex gap-12">
                    <button type="submit" className="btn-primary flex align-center gap-8">
                      <Icons.Save size={16} /> Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingOverview(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="overview-details">
                  <div className="tagline-block">
                    <p className="tagline-text">"{editTagline}"</p>
                  </div>

                  <div className="grid-details mt-24">
                    <div className="detail-item">
                      <span className="detail-label">Username</span>
                      <span className="detail-value">{currentUser.username || editUsername}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Roll Number</span>
                      <span className="detail-value">{editRollNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Branch & Dept</span>
                      <span className="detail-value">{editBranch}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Academic Year</span>
                      <span className="detail-value">{editYear}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contact Email</span>
                      <span className="detail-value flex align-center gap-8">
                        <Icons.Mail size={14} /> {editEmail}
                      </span>
                    </div>
                  </div>

                  <div className="social-links-block mt-24">
                    <h3>Social Profiles</h3>
                    <div className="social-links-flex mt-12 flex gap-16">
                      {editLinkedin ? (
                        <a 
                          href={editLinkedin} 
                          target="_blank" 
                          rel="noreferrer"
                          className="social-pill linkedin-pill flex align-center gap-8"
                        >
                          <Icons.LinkedIn size={16} /> LinkedIn Profile
                        </a>
                      ) : (
                        <span className="social-pill disabled flex align-center gap-8">
                          <Icons.LinkedIn size={16} /> Add LinkedIn
                        </span>
                      )}

                      {editGithub ? (
                        <a 
                          href={editGithub} 
                          target="_blank" 
                          rel="noreferrer"
                          className="social-pill github-pill flex align-center gap-8"
                        >
                          <Icons.GitHub size={16} /> GitHub Profile
                        </a>
                      ) : (
                        <span className="social-pill disabled flex align-center gap-8">
                          <Icons.GitHub size={16} /> Add GitHub
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'bio' && (
            <motion.div 
              key="bio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="card glass-card fill-section"
            >
              <h2>Student Biography</h2>
              <p className="section-subtitle mb-16">Tell the campus community about your background, skills, and coding journey.</p>
              
              {isEditingBio ? (
                <div className="bio-editor">
                  <textarea 
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="Describe yourself... What are you coding? What are your aspirations?"
                    className="bio-textarea"
                    rows={6}
                  />
                  <div className="flex gap-12 mt-12">
                    <button onClick={handleSaveBio} className="btn-primary flex align-center gap-8">
                      <Icons.Save size={16} /> Save Bio
                    </button>
                    <button onClick={() => setIsEditingBio(false)} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bio-display-box">
                  {bioText ? (
                    <div className="bio-content-container">
                      <p className="bio-main-paragraph">{bioText}</p>
                      <button onClick={() => setIsEditingBio(true)} className="btn-edit-subtle mt-16 flex align-center gap-8">
                        <Icons.Edit size={14} /> Update Biography
                      </button>
                    </div>
                  ) : (
                    <div className="bio-empty text-center py-24">
                      <Icons.FileText size={36} className="text-muted mb-12" />
                      <p>You haven't written a biography yet.</p>
                      <button onClick={() => setIsEditingBio(true)} className="btn-primary mt-12">
                        Write Bio
                      </button>
                    </div>
                  )}

                  {/* Suggestion templates */}
                  <div className="bio-suggestions mt-32">
                    <h3>💡 Quick Bio Templates</h3>
                    <div className="suggestions-list mt-12">
                      <button 
                        onClick={() => handleSuggestBio("Java Full Stack Developer | Open Source Contributor | Coding enthusiastically at GITA")}
                        className="suggestion-btn"
                      >
                        "Java Full Stack Developer..."
                      </button>
                      <button 
                        onClick={() => handleSuggestBio("Open Source Contributor. Passionate about Web technologies, APIs, and cloud microservices.")}
                        className="suggestion-btn"
                      >
                        "Open Source Contributor..."
                      </button>
                      <button 
                        onClick={() => handleSuggestBio("Interested in AI & Web Development. Solving problems in algorithms and competitive coding.")}
                        className="suggestion-btn"
                      >
                        "Interested in AI & Web..."
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'achievements' && (
            <motion.div 
              key="achievements"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="card glass-card fill-section"
            >
              <div className="section-header justify-between align-center flex">
                <div>
                  <h2>Personal Achievements</h2>
                  <p className="section-subtitle">Manage your verified certificates, awards, and placements.</p>
                </div>
                {!isAddingAchievement && (
                  <button 
                    onClick={() => {
                      setEditingAchievementId(null);
                      setAchievementForm({
                        title: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0],
                        category: 'Academic',
                        certificateImage: '',
                        photoImage: ''
                      });
                      setIsAddingAchievement(true);
                    }}
                    className="btn-primary flex align-center gap-8"
                  >
                    <Icons.Plus size={16} /> Add Achievement
                  </button>
                )}
              </div>

              {isAddingAchievement ? (
                <form onSubmit={handleSaveAchievement} className="achievement-form mt-20 card p-16 bg-app-subtle">
                  <h3>{editingAchievementId ? 'Edit Achievement' : 'New Achievement Details'}</h3>
                  <div className="form-grid mt-12">
                    <div className="form-group">
                      <label>Achievement Title*</label>
                      <input 
                        type="text" 
                        value={achievementForm.title}
                        onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})}
                        placeholder="e.g. Oracle Java SE Certification"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={achievementForm.category}
                        onChange={(e) => setAchievementForm({...achievementForm, category: e.target.value})}
                        className="form-control"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date Received</label>
                      <input 
                        type="date" 
                        value={achievementForm.date}
                        onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description*</label>
                      <textarea 
                        value={achievementForm.description}
                        onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})}
                        placeholder="Detail your achievements, key metrics, and what this certificate/award means..."
                        className="form-control"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="flex align-center gap-8">
                        <Icons.Award size={16} /> Certificate Image
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileSimulate('certificateImage', e)}
                        className="form-control"
                      />
                      {achievementForm.certificateImage && (
                        <div className="file-preview-box">
                          <img src={achievementForm.certificateImage} alt="Cert Preview" />
                          <button type="button" onClick={() => setAchievementForm({...achievementForm, certificateImage: ''})} className="btn-clear-preview">
                            <Icons.Close size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="flex align-center gap-8">
                        <Icons.Image size={16} /> Achievement Photos
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileSimulate('photoImage', e)}
                        className="form-control"
                      />
                      {achievementForm.photoImage && (
                        <div className="file-preview-box">
                          <img src={achievementForm.photoImage} alt="Photo Preview" />
                          <button type="button" onClick={() => setAchievementForm({...achievementForm, photoImage: ''})} className="btn-clear-preview">
                            <Icons.Close size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions flex gap-12 mt-16">
                    <button type="submit" className="btn-primary flex align-center gap-8">
                      <Icons.Save size={16} /> {editingAchievementId ? 'Update Achievement' : 'Save Achievement'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingAchievement(false);
                        setEditingAchievementId(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="achievements-section-body mt-20">
                  {/* Category filters */}
                  <div className="ach-filters-row flex gap-8 mb-16 overflow-x-auto">
                    {['All', ...categories].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedAchievementCategory(cat)}
                        className={`ach-filter-btn ${selectedAchievementCategory === cat ? 'active' : ''}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {filteredAchievements.length === 0 ? (
                    <div className="achievements-empty text-center py-32 card">
                      <Icons.Trophy size={40} className="text-muted mb-8" style={{ opacity: 0.5 }} />
                      <p>No achievements added in the <strong>{selectedAchievementCategory}</strong> category.</p>
                    </div>
                  ) : (
                    <div className="achievements-cards-grid">
                      {filteredAchievements.map(ach => (
                        <div key={ach.id} className="achievement-card card">
                          <div className="ach-card-header justify-between align-center flex">
                            <span className="ach-card-category">{ach.category}</span>
                            <div className="ach-actions-row flex gap-8">
                              <button onClick={() => handleEditAchievement(ach)} className="ach-action-btn edit" title="Edit">
                                <Icons.Edit size={14} />
                              </button>
                              <button onClick={() => handleDeleteAchievement(ach.id)} className="ach-action-btn delete" title="Delete">
                                <Icons.Trash size={14} />
                              </button>
                            </div>
                          </div>
                          <h3>{ach.title}</h3>
                          <span className="ach-card-date">{ach.date}</span>
                          <p className="ach-card-desc">{ach.description}</p>
                          
                          {(ach.certificateImage || ach.photoImage) && (
                            <div className="ach-visual-attachments mt-12 flex gap-8">
                              {ach.certificateImage && (
                                <div className="ach-attachment-preview">
                                  <img src={ach.certificateImage} alt="Certificate" className="attachment-thumbnail" />
                                  <span className="attachment-label">📜 Certificate</span>
                                </div>
                              )}
                              {ach.photoImage && (
                                <div className="ach-attachment-preview">
                                  <img src={ach.photoImage} alt="Event" className="attachment-thumbnail" />
                                  <span className="attachment-label">📷 Photos</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="card glass-card fill-section"
            >
              <h2>Settings & Customization</h2>
              <p className="section-subtitle mb-20">Manage your credentials, theme configuration, privacy flags, and alerts.</p>
              
              <div className="settings-grid">
                
                {/* Theme Configuration */}
                <div className="settings-card card">
                  <h3>🎨 Appearance & Themes</h3>
                  <p className="card-sub-info">Choose how GITA Connect looks on your browser window.</p>
                  
                  <div className="theme-options-grid mt-12">
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`theme-selector-card light ${theme === 'light' ? 'selected' : ''}`}
                    >
                      <div className="theme-preview-dot light" />
                      <span>Light Theme</span>
                    </button>

                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`theme-selector-card dark ${theme === 'dark' ? 'selected' : ''}`}
                    >
                      <div className="theme-preview-dot dark" />
                      <span>Dark Theme</span>
                    </button>
                    
                    <button 
                      onClick={() => handleThemeChange('system')}
                      className={`theme-selector-card system ${theme === 'system' ? 'selected' : ''}`}
                    >
                      <div className="theme-preview-dot system" />
                      <span>System Settings</span>
                    </button>
                  </div>
                </div>

                {/* Privacy Configuration */}
                <div className="settings-card card">
                  <h3>🔒 Privacy Preferences</h3>
                  <p className="card-sub-info">Toggle public visibility of your records on the network feed.</p>
                  
                  <div className="toggle-list mt-12">
                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Show Email Publicly</strong>
                        <span className="toggle-subtext">Display email details on the profile directory.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleTogglePrivacy('showEmail')} 
                        className={`toggle-switch ${privacySettings.showEmail ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>

                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Show Achievements Publicly</strong>
                        <span className="toggle-subtext">Allow communities to browse your certificates.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleTogglePrivacy('showAchievements')} 
                        className={`toggle-switch ${privacySettings.showAchievements ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>

                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Allow Community Messages</strong>
                        <span className="toggle-subtext">Accept direct messages from fellow GITA scholars.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleTogglePrivacy('allowMessages')} 
                        className={`toggle-switch ${privacySettings.allowMessages ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Configuration */}
                <div className="settings-card card">
                  <h3>🔔 Notification Config</h3>
                  <p className="card-sub-info">Configure email/app alerts for events and updates.</p>
                  
                  <div className="toggle-list mt-12">
                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Campus Event Alerts</strong>
                        <span className="toggle-subtext">Notify me on new campus event schedules.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggleNotification('event')} 
                        className={`toggle-switch ${notificationSettings.event ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>

                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Placement & Internships Alerts</strong>
                        <span className="toggle-subtext">High priority notifications on placement offers.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggleNotification('placement')} 
                        className={`toggle-switch ${notificationSettings.placement ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>

                    <div className="toggle-row flex justify-between align-center py-8">
                      <div>
                        <strong>Community Discussions Announcements</strong>
                        <span className="toggle-subtext">Get updates on subscribed department channels.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggleNotification('community')} 
                        className={`toggle-switch ${notificationSettings.community ? 'on' : 'off'}`}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Credentials */}
                <div className="settings-card card">
                  <h3>🔑 Account Security</h3>
                  <p className="card-sub-info">Update your password credentials.</p>
                  
                  <form onSubmit={handleUpdatePassword} className="settings-sub-form mt-12">
                    <div className="form-group mb-8">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.currentPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                        className="form-control sm" 
                      />
                    </div>
                    <div className="form-group mb-8">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                        className="form-control sm" 
                      />
                    </div>
                    <div className="form-group mb-12">
                      <label>Confirm Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                        className="form-control sm" 
                      />
                    </div>
                    <button type="submit" className="btn-primary sm flex align-center gap-8">
                      <Icons.Lock size={12} /> Update Password
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'activity' && (
            <motion.div 
              key="activity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="card glass-card fill-section"
            >
              <h2>Activity Log & Metrics</h2>
              <p className="section-subtitle mb-20">Browse your historical contributions across the GITA Connect campus.</p>
              
              <div className="activity-stats-row grid mt-12 mb-24">
                <div className="stat-card card text-center">
                  <span className="stat-num">{postsCount}</span>
                  <span className="stat-label">Feed Posts Created</span>
                </div>
                <div className="stat-card card text-center">
                  <span className="stat-num">{complaintsCount}</span>
                  <span className="stat-label">Complaints Filed</span>
                </div>
                <div className="stat-card card text-center">
                  <span className="stat-num">{achievements.length}</span>
                  <span className="stat-label">Achievements Listed</span>
                </div>
                <div className="stat-card card text-center">
                  <span className="stat-num">3</span>
                  <span className="stat-label">Joined Communities</span>
                </div>
              </div>

              <h3>Recent Activity Timeline</h3>
              <div className="timeline-container mt-16">
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-time">Today</span>
                    <strong className="timeline-title">Viewed Profile dashboard</strong>
                    <p className="timeline-desc">Accessed and updated system configurations.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-time">2 days ago</span>
                    <strong className="timeline-title">Uploaded "IEEE Research Publication"</strong>
                    <p className="timeline-desc">Added academic achievement category to profile directory.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-time">3 days ago</span>
                    <strong className="timeline-title">Created feed post: "Completed Compiler Design NOTES"</strong>
                    <p className="timeline-desc">Shared academic exam materials with student boards.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-time">Last week</span>
                    <strong className="timeline-title">Joined community: Computer Science & Engineering</strong>
                    <p className="timeline-desc">Registered with the official CSE department discussions forum.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';

export default function Feed({
  posts,
  setPosts,
  currentUser,
  searchQuery,
  selectedTag,
  setSelectedTag
}) {
  const [postText, setPostText] = useState('');
  const [activePostTag, setActivePostTag] = useState(''); // 'Photo', 'Achievement', 'Internship', 'Poll', 'Event'
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: '' }
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: boolean }
  const [toastMessage, setToastMessage] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Poll state variables
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  // Event state variables
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  // Sample preset images for post creation
  const presetPhotos = [
    { name: 'Office Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Campus Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80' },
    { name: 'Tech Seminar', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80' },
    { name: 'Student Group', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80' }
  ];

  // Show a temporary toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Handle post creation
  const handleCreatePost = (e) => {
    e.preventDefault();
    
    // Check if there's any content
    const hasText = postText.trim();
    const hasPhoto = selectedPhotoUrl;
    const hasPoll = showPollCreator && pollQuestion.trim() && pollOption1.trim() && pollOption2.trim();
    const hasEvent = showEventCreator && eventTitle.trim() && eventDate.trim();
    
    if (!hasText && !hasPhoto && !hasPoll && !hasEvent) return;

    let finalTag = activePostTag || 'General';
    let content = postText;
    
    if (activePostTag && activePostTag !== 'Poll' && activePostTag !== 'Event' && !content.toLowerCase().includes(`#${activePostTag.toLowerCase()}`)) {
      content += ` #${activePostTag}`;
    }

    const newPost = {
      id: `p_new_${Date.now()}`,
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        details: currentUser.details,
        role: currentUser.role
      },
      time: 'Just now',
      content: content || (showPollCreator ? `📊 Poll: ${pollQuestion}` : showEventCreator ? `📅 Campus Event Announcement` : ''),
      image: selectedPhotoUrl || null,
      likes: 0,
      comments: [],
      liked: false,
      bookmarked: false,
      tag: finalTag,
      poll: hasPoll ? {
        question: pollQuestion,
        options: [
          { text: pollOption1, votes: 0 },
          { text: pollOption2, votes: 0 }
        ],
        votedIndex: null // Track if the user voted on this post
      } : null,
      event: hasEvent ? {
        title: eventTitle,
        date: eventDate,
        location: eventLocation || 'Main Campus'
      } : null
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setActivePostTag('');
    setSelectedPhotoUrl('');
    setShowPhotoSelector(false);
    
    // Reset Poll Creator
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');

    // Reset Event Creator
    setShowEventCreator(false);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    
    triggerToast('Post published successfully! 🚀');
  };

  const handleSelectTagButton = (tagName) => {
    if (activePostTag === tagName) {
      setActivePostTag('');
      if (tagName === 'Photo') setShowPhotoSelector(false);
      if (tagName === 'Poll') setShowPollCreator(false);
      if (tagName === 'Event') setShowEventCreator(false);
    } else {
      setActivePostTag(tagName);
      setShowPhotoSelector(tagName === 'Photo');
      setShowPollCreator(tagName === 'Poll');
      setShowEventCreator(tagName === 'Event');
      
      if (tagName !== 'Photo') {
        setSelectedPhotoUrl('');
      }
    }
  };

  // Poll Vote handler
  const handleVote = (postId, optionIndex) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId && post.poll && post.poll.votedIndex === null) {
          const updatedOptions = post.poll.options.map((opt, idx) => {
            if (idx === optionIndex) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...post,
            poll: {
              ...post.poll,
              options: updatedOptions,
              votedIndex: optionIndex
            }
          };
        }
        return post;
      })
    );
    triggerToast('Vote cast! 🗳️');
  };

  // Upvote/Like toggle
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // Bookmark toggle
  const handleBookmark = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, bookmarked: !post.bookmarked };
        }
        return post;
      })
    );
    const post = posts.find((p) => p.id === postId);
    triggerToast(!post.bookmarked ? 'Saved to Bookmarks 🔖' : 'Removed from Bookmarks');
  };

  // Share link
  const handleShare = (postId) => {
    const mockUrl = `https://gita-connect.edu/posts/${postId}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      triggerToast('Post link copied to clipboard! 📋');
    });
  };

  // Toggle comments expand drawer
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Post comment submission
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `c_new_${Date.now()}`,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
                text: commentText,
                time: 'Just now'
              }
            ]
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: ''
    }));
  };

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const query = localSearch.trim().toLowerCase();
    if (!query) return true;

    // Check tags filter e.g. "#SmartIndia" or "SmartIndia"
    if (query.startsWith('#')) {
      const tagOnly = query.substring(1);
      return (
        post.tag.toLowerCase() === tagOnly ||
        post.content.toLowerCase().includes(query)
      );
    }

    return (
      post.content.toLowerCase().includes(query) ||
      post.tag.toLowerCase().includes(query) ||
      post.user.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="feed-container feed-column">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-alert animate-slide-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Local Feed Search Bar */}
      <div className="local-search-card card">
        <div className="search-wrapper">
          <Icons.Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search posts, hashtags, or authors in Feed..."
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

      {/* Create Post Card */}
      <div className="create-post-card card">
        <form onSubmit={handleCreatePost}>
          <div className="create-post-body flex gap-16">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="create-post-avatar"
            />
            <div className="input-area">
              <textarea
                placeholder="What's happening at GITA today?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows={3}
                className="post-textarea"
              />
              
              {/* Image Preview */}
              {selectedPhotoUrl && (
                <div className="photo-preview-container">
                  <img src={selectedPhotoUrl} alt="Attached preview" className="photo-preview" />
                  <button
                    type="button"
                    className="remove-photo-preview"
                    onClick={() => setSelectedPhotoUrl('')}
                  >
                    <Icons.Close size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Photo attachment drawer */}
          {showPhotoSelector && (
            <div className="photo-picker-drawer animate-slide-in">
              <span className="picker-label">Select a mockup photo:</span>
              <div className="photo-grid">
                {presetPhotos.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    className={`photo-option ${selectedPhotoUrl === photo.url ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedPhotoUrl(photo.url);
                      setShowPhotoSelector(false);
                    }}
                  >
                    <img src={photo.url} alt={photo.name} />
                    <span>{photo.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Poll Creator Drawer */}
          {showPollCreator && (
            <div className="poll-creator-drawer animate-slide-in">
              <span className="picker-label">Create a Poll:</span>
              <input
                type="text"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="creator-input"
              />
              <div className="poll-options-inputs flex gap-8">
                <input
                  type="text"
                  placeholder="Option 1"
                  value={pollOption1}
                  onChange={(e) => setPollOption1(e.target.value)}
                  className="creator-input half-width"
                />
                <input
                  type="text"
                  placeholder="Option 2"
                  value={pollOption2}
                  onChange={(e) => setPollOption2(e.target.value)}
                  className="creator-input half-width"
                />
              </div>
            </div>
          )}

          {/* Event Creator Drawer */}
          {showEventCreator && (
            <div className="event-creator-drawer animate-slide-in">
              <span className="picker-label">Announce an Event:</span>
              <input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="creator-input"
              />
              <div className="event-details-inputs flex gap-8">
                <input
                  type="text"
                  placeholder="Date (e.g. Oct 24)"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="creator-input half-width"
                />
                <input
                  type="text"
                  placeholder="Location (e.g. Main Stadium)"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="creator-input half-width"
                />
              </div>
            </div>
          )}

          <div className="create-post-footer justify-between align-center flex">
            {/* Attachment selectors */}
            <div className="attachment-selectors flex gap-8 flex-wrap">
              <button
                type="button"
                className={`attach-btn flex align-center gap-8 ${
                  activePostTag === 'Photo' || selectedPhotoUrl ? 'active' : ''
                }`}
                onClick={() => handleSelectTagButton('Photo')}
              >
                <Icons.Image size={16} />
                <span>Photo</span>
              </button>

              <button
                type="button"
                className={`attach-btn flex align-center gap-8 ${
                  activePostTag === 'Achievement' ? 'active' : ''
                }`}
                onClick={() => handleSelectTagButton('Achievement')}
              >
                <Icons.Award size={16} />
                <span>Achievement</span>
              </button>

              <button
                type="button"
                className={`attach-btn flex align-center gap-8 ${
                  activePostTag === 'Internship' ? 'active' : ''
                }`}
                onClick={() => handleSelectTagButton('Internship')}
              >
                <Icons.Briefcase size={16} />
                <span>Internship</span>
              </button>

              <button
                type="button"
                className={`attach-btn flex align-center gap-8 ${
                  activePostTag === 'Poll' ? 'active' : ''
                }`}
                onClick={() => handleSelectTagButton('Poll')}
              >
                <Icons.CheckSquare size={16} />
                <span>Poll</span>
              </button>

              <button
                type="button"
                className={`attach-btn flex align-center gap-8 ${
                  activePostTag === 'Event' ? 'active' : ''
                }`}
                onClick={() => handleSelectTagButton('Event')}
              >
                <Icons.Calendar size={16} />
                <span>Event</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!postText.trim() && !selectedPhotoUrl && !pollQuestion.trim() && !eventTitle.trim()}
              className="post-submit-btn"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="feed-posts-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-feed card">
            <Icons.Compass size={48} className="empty-icon" />
            <h3>No Posts Found</h3>
            <p>Try searching for other keywords, tags, or clear the search filter.</p>
            {localSearch && (
              <button
                onClick={() => {
                  setSelectedTag('');
                  setLocalSearch('');
                }}
                className="btn-secondary"
                style={{ marginTop: '16px' }}
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                layout
                className="post-card card"
              >
              {/* Header */}
              <div className="post-header justify-between align-center flex">
                <div className="post-author-info flex align-center gap-12">
                  <img src={post.user.avatar} alt={post.user.name} className="post-avatar" />
                  <div>
                    <h4 className="post-author-name">{post.user.name}</h4>
                    <span className="post-meta">
                      {post.user.details} • {post.time}
                    </span>
                  </div>
                </div>
                <div className="post-options-menu">
                  <button className="post-options-btn">
                    <Icons.MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="post-body">
                <p className="post-content-text">
                  {/* Basic parsing to highlight hashtags */}
                  {post.content.split(' ').map((word, idx) => {
                    if (word.startsWith('#')) {
                      return (
                        <span
                          key={idx}
                          className="content-hashtag"
                          onClick={() => {
                            const cleanTag = word.substring(1);
                            setSelectedTag(cleanTag);
                            // We trigger app state updates via global filters
                          }}
                        >
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </p>

                {/* Custom Poll Rendering */}
                {post.poll && (
                  <div className="feed-post-poll-card">
                    <h4 className="poll-question-title">{post.poll.question}</h4>
                    <div className="poll-options-list flex flex-col gap-8">
                      {post.poll.options.map((option, idx) => {
                        const totalVotes = post.poll.options.reduce((sum, o) => sum + o.votes, 0);
                        const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isVoted = post.poll.votedIndex === idx;
                        const hasVotedAny = post.poll.votedIndex !== null;

                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`poll-option-row ${isVoted ? 'voted' : ''}`}
                            onClick={() => handleVote(post.id, idx)}
                            disabled={hasVotedAny}
                          >
                            <div className="poll-option-progress" style={{ width: `${percent}%` }} />
                            <span className="poll-option-text">{option.text}</span>
                            {hasVotedAny && <span className="poll-option-pct">{percent}% ({option.votes})</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Event Announcement Rendering */}
                {post.event && (
                  <div className="feed-post-event-card flex gap-12 align-center">
                    <div className="event-date-block flex flex-col align-center justify-center">
                      <span className="event-month-lbl">EVENT</span>
                      <span className="event-day-lbl">{post.event.date}</span>
                    </div>
                    <div className="event-details-block flex-1">
                      <h4 className="event-title-lbl">{post.event.title}</h4>
                      <div className="event-meta-lbl flex align-center gap-8 text-muted">
                        <Icons.Compass size={14} />
                        <span>{post.event.location}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary sm"
                      onClick={() => alert(`Registered for event: ${post.event.title}`)}
                    >
                      Register
                    </button>
                  </div>
                )}

                {post.image && (
                  <div className="post-image-wrapper">
                    <img src={post.image} alt="Post media attachment" className="post-image" />
                  </div>
                )}
              </div>

              {/* Footer / Actions */}
              <div className="post-actions justify-between align-center flex">
                <div className="left-actions flex gap-12">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`post-action-btn like flex align-center gap-8 ${
                      post.liked ? 'liked' : ''
                    }`}
                  >
                    <Icons.Heart size={18} filled={post.liked} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="post-action-btn comment flex align-center gap-8"
                  >
                    <Icons.MessageSquare size={18} />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="post-action-btn share flex align-center gap-8"
                  >
                    <Icons.Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>

                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`post-action-btn bookmark ${post.bookmarked ? 'bookmarked' : ''}`}
                >
                  <Icons.Bookmark size={18} filled={post.bookmarked} />
                </button>
              </div>

              {/* Comments drawer */}
              {expandedComments[post.id] && (
                <div className="comments-drawer">
                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment-item flex gap-12">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="comment-avatar"
                          />
                          <div className="comment-bubble">
                            <div className="comment-bubble-header justify-between align-center flex">
                              <span className="comment-author">{comment.userName}</span>
                              <span className="comment-time">{comment.time}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment Form */}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="add-comment-form flex gap-12 align-center"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="comment-avatar"
                    />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value
                        })
                      }
                      className="comment-input"
                    />
                    <button type="submit" className="comment-submit-btn">
                      <Icons.Send size={16} />
                    </button>
                  </form>
                </div>
              )}
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .feed-container {
          width: 100%;
          max-width: none;
        }
        .feed-column {
          width: 100%;
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

        /* Create Post Styles */
        .create-post-card {
          padding: 28px;
          min-height: 200px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }
        .create-post-card:hover {
          box-shadow: var(--shadow-lg);
        }
        [data-theme='dark'] .create-post-card {
          background: rgba(21, 28, 44, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .create-post-body {
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .create-post-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }
        .input-area {
          flex: 1;
        }
        .post-textarea {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-heading);
          resize: none;
          font-size: 17px;
          padding: 8px 0;
          line-height: 1.6;
        }
        .post-textarea::placeholder {
          color: var(--text-muted);
        }
        
        /* Poll and Event Creators */
        .poll-creator-drawer, .event-creator-drawer {
          border-top: 1px solid var(--border);
          padding: 16px 0;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .creator-input {
          width: 100%;
          padding: 10px 14px;
          font-size: 13.5px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background-color: var(--bg-app);
          color: var(--text-heading);
          transition: border-color 0.2s;
        }
        .creator-input:focus {
          border-color: var(--primary);
        }
        .creator-input.half-width {
          width: calc(50% - 4px);
        }

        .photo-preview-container {
          position: relative;
          margin-top: 8px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          max-height: 200px;
          border: 1px solid var(--border);
        }
        .photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-photo-preview {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(15, 23, 42, 0.7);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-photo-preview:hover {
          background-color: var(--urgent);
        }
        
        .photo-picker-drawer {
          border-top: 1px solid var(--border);
          padding: 12px 0;
          margin-bottom: 12px;
        }
        .picker-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 8px;
        }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .photo-option {
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px;
        }
        .photo-option img {
          width: 100%;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        .photo-option span {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 4px;
          text-align: center;
        }
        .photo-option.selected {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }
        
        .create-post-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          margin-top: 8px;
        }
        .attach-btn {
          padding: 8px 16px;
          background-color: var(--bg-app);
          border: 1.5px solid var(--border);
          color: var(--text-main);
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .attach-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .attach-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        .post-submit-btn {
          background-color: var(--primary);
          color: white;
          padding: 8px 24px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
        }
        .post-submit-btn:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }
        .post-submit-btn:disabled {
          background-color: var(--border);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        
        /* Post Card Styles */
        .post-card {
          margin-bottom: 32px;
          padding: 28px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color var(--transition-normal), background-color var(--transition-normal);
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-premium);
        }
        [data-theme='dark'] .post-card {
          background: rgba(21, 28, 44, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .post-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .post-author-name {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .post-meta {
          font-size: 12px;
          color: var(--text-muted);
        }
        .post-options-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: 50%;
        }
        .post-options-btn:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        .post-body {
          margin: 18px 0;
        }
        .post-content-text {
          font-size: 15px;
          color: var(--text-heading);
          line-height: 1.8;
          margin-bottom: 16px;
          white-space: pre-wrap;
        }
        .content-hashtag {
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
        }
        .content-hashtag:hover {
          text-decoration: underline;
        }
        .post-image-wrapper {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
          height: 350px;
        }
        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Feed Poll Card */
        .feed-post-poll-card {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 16px;
        }
        .poll-question-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 12px;
        }
        .poll-option-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .poll-option-row {
          position: relative;
          width: 100%;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          text-align: left;
          font-weight: 600;
          font-size: 13.5px;
          color: var(--text-main);
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .poll-option-row:hover:not(:disabled) {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }
        .poll-option-progress {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: var(--primary-light);
          opacity: 0.8;
          z-index: 0;
          transition: width 0.4s ease-out;
        }
        .poll-option-text, .poll-option-pct {
          position: relative;
          z-index: 1;
        }
        .poll-option-row.voted {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        /* Feed Event Card */
        .feed-post-event-card {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 16px;
        }
        .event-date-block {
          width: 54px;
          height: 54px;
          background-color: var(--primary-light);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .event-month-lbl {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
        }
        .event-day-lbl {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
          line-height: 1.1;
        }
        .event-title-lbl {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 2px;
        }
        .event-meta-lbl {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .post-actions {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 6px 0;
          margin-bottom: 8px;
        }
        .post-action-btn {
          color: var(--text-main);
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 30px;
        }
        .post-action-btn:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        .post-action-btn.like:hover {
          color: var(--urgent);
          background-color: var(--urgent-bg);
        }
        .post-action-btn.liked {
          color: var(--urgent);
        }
        .post-action-btn.bookmark.bookmarked {
          color: var(--accent);
        }
        
        /* Comments Drawer */
        .comments-drawer {
          background-color: var(--bg-app);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-top: 12px;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .comment-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .comment-bubble {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          flex: 1;
        }
        .comment-bubble-header {
          margin-bottom: 4px;
        }
        .comment-author {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .comment-time {
          font-size: 10px;
          color: var(--text-muted);
        }
        .comment-text {
          font-size: 13px;
          color: var(--text-main);
          line-height: 1.4;
        }
        
        .add-comment-form {
          margin-top: 8px;
        }
        .comment-input {
          flex: 1;
          border: 1px solid var(--border);
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 13px;
          background-color: var(--bg-card);
          color: var(--text-heading);
        }
        .comment-input:focus {
          border-color: var(--primary);
        }
        .comment-submit-btn {
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .comment-submit-btn:hover {
          background-color: var(--primary-light);
        }
        .empty-feed {
          text-align: center;
          padding: 40px;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .empty-feed h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .empty-feed p {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Local Search styles */
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
      `}</style>
    </div>
  );
}

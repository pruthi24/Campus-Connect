import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, User as UserIcon, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUsers(usersList);
        setPosts(postsList);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
      setLoading(false);
    }

    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        setPosts(posts.filter(p => p.id !== postId));
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  // If we wanted strict client-side protection, we could check here:
  if (userRole !== 'admin') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-app)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-heading)', fontWeight: '700' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-heading)' }}>Back to App</button>
          <button onClick={async () => { await logout(); navigate('/login'); }} style={{ padding: '8px 16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-heading)' }}>Log Out</button>
        </div>
      </header>

      {loading ? (
        <div>Loading database records...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          
          {/* USERS TABLE */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <UserIcon size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '20px', color: 'var(--text-heading)', margin: 0 }}>Registered Users ({users.length})</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Email</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Role</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px' }}>{u.displayName || 'Unnamed'}</td>
                      <td style={{ padding: '12px 8px' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          backgroundColor: u.role === 'admin' ? 'var(--primary-light)' : 'var(--border)',
                          color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-main)'
                        }}>
                          {u.role ? u.role.toUpperCase() : 'STUDENT'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* POSTS TABLE */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '20px', color: 'var(--text-heading)', margin: 0 }}>Live Posts ({posts.length})</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Author</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Content Snippet</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)' }}>Date</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-heading)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px' }}>{p.user?.name || 'Unknown'}</td>
                      <td style={{ padding: '12px 8px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.text || (p.image ? '[Image Post]' : '')}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : 'N/A'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeletePost(p.id)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

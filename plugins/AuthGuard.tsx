import React, { useEffect, useState } from 'react';
import { useLocation } from 'rspress/runtime';
import { authConfig, passwordHints } from './auth-config';

const AuthGuard: React.FC = () => {
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticatedRoutes, setAuthenticatedRoutes] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 检查当前路由是否需要密码保护
    const currentRoute = location.pathname;
    const isProtected = Object.keys(authConfig).some(route => 
      currentRoute.endsWith(route) || currentRoute === route
    );

    if (isProtected && !authenticatedRoutes.has(currentRoute)) {
      // 检查 sessionStorage 中的认证状态
      const isAuthenticated = sessionStorage.getItem(`auth_${currentRoute}`) === 'true';
      
      if (isAuthenticated) {
        setAuthenticatedRoutes(prev => new Set([...prev, currentRoute]));
      } else {
        setShowPasswordModal(true);
        // 阻止页面内容显示
        setTimeout(() => {
          const mainContent = document.querySelector('.rspress-doc');
          if (mainContent) {
            (mainContent as HTMLElement).style.display = 'none';
          }
        }, 100);
      }
    }
  }, [location.pathname, authenticatedRoutes]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentRoute = location.pathname;
    
    // 找到匹配的保护路由
    const matchedRoute = Object.keys(authConfig).find(route => 
      currentRoute.endsWith(route) || currentRoute === route
    );

    if (matchedRoute && authConfig[matchedRoute].password === password) {
      // 密码正确，添加到已认证路由
      setAuthenticatedRoutes(prev => new Set([...prev, currentRoute]));
      setShowPasswordModal(false);
      setPassword('');
      setError('');
      
      // 显示页面内容
      const mainContent = document.querySelector('.rspress-doc');
      if (mainContent) {
        (mainContent as HTMLElement).style.display = '';
      }
      
      // 将认证状态保存到 sessionStorage
      sessionStorage.setItem(`auth_${currentRoute}`, 'true');
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  if (!showPasswordModal) {
    return null;
  }

  const currentRoute = location.pathname;
  const matchedRoute = Object.keys(authConfig).find(route => 
    currentRoute.endsWith(route) || currentRoute === route
  );
  const routeConfig = matchedRoute ? authConfig[matchedRoute] : null;
  const hint = matchedRoute ? passwordHints[matchedRoute] : undefined;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>
          {routeConfig?.title || '🔒 页面访问受限'}
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          {routeConfig?.description || '此页面需要密码才能访问，请输入正确的密码：'}
        </p>
        
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
          
          {error && (
            <p style={{ 
              color: '#e74c3c', 
              marginBottom: '1rem',
              fontSize: '14px'
            }}>
              {error}
            </p>
          )}
          
          {hint && (
            <p style={{ 
              color: '#3498db', 
              marginBottom: '1rem',
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              💡 {hint}
            </p>
          )}
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#3498db';
            }}
          >
            确认
          </button>
        </form>
        
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '12px', 
          color: '#999',
          textAlign: 'center'
        }}>
          提示：输入正确密码后，当前会话将保持登录状态
        </p>
      </div>
    </div>
  );
};

export default AuthGuard;

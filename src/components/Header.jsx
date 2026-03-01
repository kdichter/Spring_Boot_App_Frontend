import React from 'react'
import { useState, useRef, useEffect } from 'react'

const Header = ({ toggleCreateModal, toggleDeleteModal, nbOfContacts, currentUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='header'>
      <div className='container'>

        {/* Title + Hamburger grouped together */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>


          <div className='hamburger-menu' ref={menuRef}>
            <button
              className='btn hamburger-btn'
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>

            {menuOpen && (
              <div className='dropdown'>
                <div className='dropdown__user'>
                  <i className='bi bi-person-circle'></i>
                  <div>
                    <p className='dropdown__label'>Signed in as</p>
                    <p className='dropdown__username'>{currentUser || 'Unknown'}</p>
                  </div>
                </div>
                <div className='divider'></div>
                <button
                  className='dropdown__logout'
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                >
                  <i className='bi bi-box-arrow-right'></i> Logout
                </button>
              </div>
            )}
          </div>
          <h3>Contact List ({nbOfContacts})</h3>
        </div>

        <div className='buttonGroup'>
          <button onClick={() => toggleCreateModal(true)} className='btn'>
            <i className='bi bi-plus-square'></i> Add New Contact
          </button>
          <button onClick={() => toggleDeleteModal(true)} className='btn'>
            <i className='bi bi-x-square'></i> Delete Contact
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header
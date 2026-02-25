import React from 'react'

const Header = ({ toggleCreateModal, toggleDeleteModal, nbOfContacts }) => {
// Could also pass in props instead of {}
// props.nbOfContacts
  return (
    <header className = 'header'>
        <div className = 'container'>
            <h3>Contact List ({nbOfContacts})</h3>
            <div className = 'buttonGroup'>
              <button onClick = {() => toggleCreateModal(true)} className='btn'>
                  <i className='bi bi-plus-square'></i> Add New Contact
              </button>
              <button onClick  ={() => toggleDeleteModal(true)} className='btn'>
                  <i className='bi bi-x-square'></i> Delete Contact
              </button>
            </div>
        </div>
    </header>
  )
}

export default Header
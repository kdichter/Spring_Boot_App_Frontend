import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import { getContacts, saveContact, updatePhoto, updateContact } from './api/ContactService';
import { isAuthenticated, logout } from './api/AuthService';
import { toastError, toastSuccess } from './api/ToastService';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
  });
  const navigate = useNavigate();

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data);
    } catch(error) {
      console.error('Error fetching contacts:', error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        navigate('/login', { replace: true });
      }
      }
    }

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
  }

  const handleNewContact = async (event) => {
    event.preventDefault()
    try {
      const { data } = await saveContact(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });
      getAllContacts();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateContact = async (contact) => {
    try {
      const { data } = await updateContact(contact);
       toastSuccess('Contact Updated');
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }

  const handleUpdateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
      toastSuccess('Photo updated');
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }

  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  }

  return (
    <>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route 
        path="/contacts" 
        element={
          <ProtectedRoute>
            <ContactsPage 
              data={data}
              currentPage={currentPage}
              getAllContacts={getAllContacts}
              toggleModal={toggleModal}
              handleLogout={handleLogout}
            />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/contacts/:id" 
        element={
          <ProtectedRoute>
            <ContactDetail 
              handleUpdateContact = {handleUpdateContact}
              handleUpdateImage = {handleUpdateImage}
            />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated() ? 
            <Navigate to="/contacts" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>

    {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={values.email} onChange={onChange} name='email' required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onChange} name='title' required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" value={values.phone} onChange={onChange} name='phone' required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={values.address} onChange={onChange} name='address' required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" value={values.status} onChange={onChange} name='status' required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

// Separate component for the contacts page
function ContactsPage({ data, currentPage, getAllContacts, toggleModal, handleLogout }) {
  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header 
        toggleModal={toggleModal} 
        nbOfContacts={data?.totalElements || 0} 
      />
      <div style={{ padding: '10px', textAlign: 'right' }}>
        <button onClick={handleLogout} className='btn'>
          Logout
        </button>
      </div>
      <ContactList 
        data={data} 
        currentPage={currentPage} 
        getAllContacts={getAllContacts} 
      />
      <ToastContainer />
    </>
  );
}

export default App;

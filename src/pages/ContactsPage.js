import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, saveContact, updatePhoto, updateContact } from '../api/ContactService';
import { logout } from '../api/AuthService';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import ContactList from '../components/ContactList';
import { toastError, toastSuccess } from '../api/ToastService';
import 'react-toastify/dist/ReactToastify.css';

const ContactsPage = () => {
    const modalRef = useRef();
    const fileRef = useRef();

    // Contact list state
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    // New contact from state
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
    });

    // File state for profile photo
    const [file, setFile] = useState(undefined);

    const navigate = useNavigate();

    const getAllContacts = async (page = 0, size = 10) => {
        try {
            setCurrentPage(page);
            const { data } = await getContacts(page, size);
            setData(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            // If unauthorized, redirect to login
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
        }
    }

    // Handle form input changes
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    // Handle creating a new contact
    const handleNewContact = async (event) => {
        event.preventDefault()

        try {
            const { data } = await saveContact(values);
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', data.id);
            const { data: photoUrl } = await updatePhoto(formData);

            // Reset modal and form state
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
            toastSuccess("Contact Created");
        } catch (error) {
            toastError(error.message);
        }
    }

    const toggleModal = (show) => {
        show ? modalRef.current.showModal() : modalRef.current.close();
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    }


    useEffect(() => {
        getAllContacts();
    }, []);

    return (
        <>
            <Header
                toggleModal={toggleModal}
                nbOfContacts={data?.totalElements || 0}
            />
            <main classname='main'>
                <div className='container'>
                    <ContactList
                        data={data}
                        currentPage={currentPage}
                        getAllContacts={getAllContacts}
                    />
                    <div style={{textAlign: 'right' }}>
                        <button onClick={handleLogout} className='btn'>
                            Logout
                        </button>
                    </div>
                </div>
            </main>



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
        </>
    );
}

export default ContactsPage;
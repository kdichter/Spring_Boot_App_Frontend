import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, saveContact, updatePhoto, deleteContact } from '../api/ContactService';
import { logout } from '../api/AuthService';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import ContactList from '../components/ContactList';
import { toastError, toastSuccess } from '../api/ToastService';
import 'react-toastify/dist/ReactToastify.css';

const ContactsPage = () => {
    const modalRef = useRef();
    const deleteModalRef = useRef();
    const fileRef = useRef();

    // Contact list state
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    // File state for profile photo
    const [file, setFile] = useState(undefined);

    // New contact from state
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: 'INACTIVE',
    });

    // State for delete modal
    const [selectedContactId, setSelectedContactId] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    // Filter contacts based on search
    const filteredContacts = data?.content?.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const getAllContacts = async (page = 0, size = 8) => {
        try {
            setCurrentPage(page);
            const { data } = await getContacts(page, size);
            setData(data);
        } catch (error) {
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

            if (file) {
                const formData = new FormData();
                formData.append('id', data.id);
                formData.append('file', file);

                await updatePhoto(formData);
            }



            // Reset modal and form state
            toggleCreateModal(false);
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

    const handleDeleteContact = async (event) => {
        event.preventDefault()

        if (!selectedContactId) {
            toastError('Please select a contact to delete');
            return;
        }

        try {
            await deleteContact(selectedContactId);
            toggleDeleteModal(false);
            getAllContacts(currentPage);
            toastSuccess("Contact Deleted");
        } catch (error) {
            toastError(error.message);
        }

    }

    const toggleCreateModal = (show) => {
        show ? modalRef.current.showModal() : modalRef.current.close();
    };

    const toggleDeleteModal = (show) => {
        show ? deleteModalRef.current.showModal() : deleteModalRef.current.close();
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
                toggleCreateModal={toggleCreateModal}
                toggleDeleteModal={toggleDeleteModal}
                nbOfContacts={data?.totalElements || 0}
            />
            <main className='main'>
                <div className='container'>
                    <ContactList
                        data={data}
                        currentPage={currentPage}
                        getAllContacts={getAllContacts}
                    />
                    <div style={{ textAlign: 'right' }}>
                        <button onClick={handleLogout} className='btn'>
                            Logout
                        </button>
                    </div>
                </div>
            </main>



            {/* Create Modal */}
            <dialog ref={modalRef} className="modal" id="modal">
                <div className="modal__header">
                    <h3>New Contact</h3>
                    <i onClick={() => toggleCreateModal(false)} className="bi bi-x-lg"></i>
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
                                <input type="text" value={values.email} onChange={onChange} name='email' />
                            </div>
                            <div className="input-box">
                                <span className="details">Title</span>
                                <input type="text" value={values.title} onChange={onChange} name='title' />
                            </div>
                            <div className="input-box">
                                <span className="details">Phone Number</span>
                                <input type="text" value={values.phone} onChange={onChange} name='phone' />
                            </div>
                            <div className="input-box">
                                <span className="details">Address</span>
                                <input type="text" value={values.address} onChange={onChange} name='address' />
                            </div>
                            <div className="input-box">
                                <span className="details">Account Status</span>
                                <select
                                    value={values.status}
                                    onChange={onChange}
                                    name='status'
                                    required
                                    className="status-select"
                                >
                                    {/* <option value="">-- Select Status --</option> */}
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="ACTIVE">Active</option>

                                </select>
                            </div>
                            <div className="file-input">
                                <span className="details">Profile Photo</span>
                                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' />
                            </div>
                        </div>
                        <div className="form_footer">
                            <button onClick={() => toggleCreateModal(false)} type='button' className="btn btn-danger">Cancel</button>
                            <button type='submit' className="btn">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Delete Modal */}
            <dialog ref={deleteModalRef} className="modal" id="modal">
                <div className="modal__header">
                    <h3>Delete Contact</h3>
                    <i onClick={() => toggleDeleteModal(false)} className="bi bi-x-lg"></i>
                </div>
                <div className="divider"></div>
                <div className="modal__body">
                    <form onSubmit={handleDeleteContact}>
                        {/* Search input */}
                        <div className="input-box">
                            <span className="details">Search Contacts</span>
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Filtered dropdown */}
                        <div className="input-box">
                            <span className="details">Select Contact to Delete</span>
                            <select
                                value={selectedContactId}
                                onChange={(e) => setSelectedContactId(e.target.value)}
                                required
                                className="contact-select"
                            >
                                <option value="">-- Choose a contact --</option>
                                {filteredContacts?.map(contact => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.name} ({contact.email})
                                    </option>
                                ))}
                            </select>
                            <p className="helper-text">
                                Showing {filteredContacts?.length || 0} of {data?.totalElements || 0} contacts
                            </p>
                        </div>
                        <div className="form_footer">
                            <button onClick={() => toggleDeleteModal(false)} type='button' className="btn btn-danger">Cancel</button>
                            <button type='submit' className="btn">Confirm</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}

export default ContactsPage;
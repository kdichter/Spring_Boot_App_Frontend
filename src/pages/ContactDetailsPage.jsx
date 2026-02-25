import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { getContact } from '../api/ContactService'
import { updateContact, deleteContact, updatePhoto } from '../api/ContactService';
import defaultIcon from '../assets/default_icon.jpg';
import { toastError, toastSuccess } from '../api/ToastService';
import 'react-toastify/dist/ReactToastify.css';

const ContactDetail = () => {
    const inputRef = useRef();
    const deleteConfirmationRef = useRef();
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoUrl: '',
    });

    const { id } = useParams();

    const fetchContact = async (id) => {
        try {
            const { data } = await getContact(id);
            setContact(data);
        } catch (error) {
            toastError(error.message);
        }
    };

    const navigate = useNavigate();

    const selectImage = () => {
        inputRef.current.click();
    };

    const updateImage = async (file) => {
        try {
            const previewUrl = URL.createObjectURL(file);
            setContact((prev) => ({ ...prev, photoUrl: previewUrl }));

            const formData = new FormData();
            formData.append('id', id);
            formData.append('file', file);
            

            await updatePhoto(formData);
            toastSuccess('Photo updated');
        } catch (error) {
            toastError(error.message);
        }
    };

    // Handle form input changes
    const onChange = (event) => {
        setContact({ ...contact, [event.target.name]: event.target.value });
    };

    // Handle for updating the contact information
    const handleUpdateContact = async (event) => {
        // prevent form from submitting and reloading broswer
        event.preventDefault();

        try {
            const { data } = await updateContact(contact);
            console.log("Status from backend:", data.status);
            toastSuccess('Contact Updated');
            fetchContact(id);
        } catch (error) {
            toastError(error.message);
        }

    };

    const handleDeleteContact = async (event) => {
        event.preventDefault()
        try {
            await deleteContact(contact.id);
            toggleDeleteConfirmationModal(false);
            toastSuccess("Contact Deleted");
            navigate('/contacts', { replace: true });
        } catch (error) {
            toastError(error.message);
        }

    }

    const toggleDeleteConfirmationModal = (show) => {
        show ? deleteConfirmationRef.current.show() : deleteConfirmationRef.current.close();
    }

    useEffect(() => {
        fetchContact(id);
    }, [id]);

    return (
        <>
            <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoUrl || defaultIcon} alt={contact.name} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}</p>
                        <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MG</p>
                        <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
                    </div>
                </div>
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={handleUpdateContact} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange} name="email"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange} name="phone"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name="title" />
                                </div>
                                <div className="input-box">
                                    <span className="details">Account Status</span>
                                    <select
                                        value={contact.status}
                                        onChange={onChange}
                                        name='status'
                                        className="status-select"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                                <button onClick={() => toggleDeleteConfirmationModal(true)} type="button" className="btn btn-danger">Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <dialog ref={deleteConfirmationRef} className="modal" id="modal">
                <div className="modal__header">
                    <h3>New Contact</h3>
                    <i onClick={() => toggleDeleteConfirmationModal(false)} className="bi bi-x-lg"></i>
                </div>
                <div className="divider"></div>
                <div className="modal__body">
                    <form onSubmit={handleDeleteContact}>
                        <div>Are you sure you want to delete this contact</div>
                        <div className="form_footer">
                            <button onClick={() => toggleDeleteConfirmationModal(false)} type='button' className="btn btn-danger">Cancel</button>
                            <button type='submit' className="btn">Confirm</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => updateImage(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    )
}

export default ContactDetail
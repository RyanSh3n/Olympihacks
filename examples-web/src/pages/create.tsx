import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db, firebase, storage } from '../firebase';

type FormData = {
    name: string;
    date: string;
    location: string;
    description: string;
    image: FileList;
};

const CreateEventForm: React.FC = () => {
    const { register, handleSubmit, watch } = useForm<FormData>();
    const [uploading, setUploading] = useState(false);
    const imageUpload = watch('image');

    const onSubmit = handleSubmit(async ({ name, date, location, description, image }) => {
        if (!image[0]) return;
        setUploading(true);

        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${image[0].name}`);
        await imageRef.put(image[0]);
        const imageUrl = await imageRef.getDownloadURL();

        db.collection('events').add({
            name,
            date,
            location,
            description,
            imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            console.log('Event added!');
            setUploading(false);
        })
        .catch(error => {
            console.error('Error adding event: ', error);
            setUploading(false);
        });
    });


    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <label className="block">
                <span className="text-gray-700">Event Image</span>
                <input {...register('image')} type="file" accept="image/*" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </label>
            <label className="block">
                <span>Event Name</span>
                <input {...register('name')} placeholder="Event Name" required className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </label>
            <label className="block">
                <span>Date</span>
                <input {...register('date')} placeholder="Date" required className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </label>
            <label className="block">
                <span>Location</span>
                <input {...register('location')} placeholder="Location" required className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </label>
            <label className="block">
                <span>Description</span>
                <textarea {...register('description')} placeholder="This event is about ..." required className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </label>
            <button type="submit" disabled={uploading} className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white">{uploading ? 'Uploading...' : 'Create Event'}</button>
        </form>

    );
};

export default CreateEventForm;

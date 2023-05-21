import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { db, firebase, storage } from '../firebase';

type FormData = {
    name: string;
    date: string;
    price: number;
    numTickets: number;
    location: string;
    description: string;
    image: FileList;
};

const CreateEventForm: React.FC = () => {
    const { register, handleSubmit, watch } = useForm<FormData>();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const imageUpload = watch('image');

    const router = useRouter()
    const navigateToHome = () => {
        router.push('/')
    }

    useEffect(() => {
        if (!imageUpload || imageUpload.length === 0) {
            setPreview(null);
            return;
        }

        const file = imageUpload[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result as string);
        };

        reader.readAsDataURL(file);
    }, [imageUpload]);

    const onSubmit = handleSubmit(async ({ name, price, numTickets, date, location, description, image }) => {
        if (!image[0]) return;
        setUploading(true);

        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${image[0].name}`);
        await imageRef.put(image[0]);
        const imageUrl = await imageRef.getDownloadURL();

        const newEventRef = db.collection('events').doc();

        await newEventRef.set({
            name,
            date,
            price,
            location,
            description,
            imageUrl,
            href: `/events/${newEventRef.id}`,
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
        navigateToHome()
    });


    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 px-40 mb-10">
            
            <label className="mt-1 block text-m font-medium leading-4 cursor-pointer border-2 border-zinc-800 text-white hover:bg-indigo-900 hover:border-indigo-400 text-m text-white px-4 py-3 rounded">
                Select Event Image
                <input 
                    {...register('image')} 
                    type="file" 
                    accept="image/*" 
                    required 
                    className="hidden"
                />
            </label>
            {preview && <img src={preview} alt="Event Preview" className="mt-4 w-full h-64 object-cover"/>}


            <label htmlFor="title" className="block text-sm font-medium leading-4">
                Event Name
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <input
                {...register('name')}
                required
                type="text"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <label className="block text-sm font-medium leading-4">
                Ticket Price
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <span className="text-gray-500 sm:text-sm m-2">$</span>
                <input
                {...register('price')}
                required
                type="number"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <label className="block text-sm font-medium leading-4">
                Number of Tickets
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <input
                {...register('numTickets')}
                required
                type="number"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <label htmlFor="date" className="block text-sm font-medium leading-4">
                Date
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <input
                {...register('date')}
                required
                type="text"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <label htmlFor="location" className="block text-sm font-medium leading-4">
                Location
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <input
                {...register('location')}
                required
                type="text"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <label htmlFor="description" className="block text-sm font-medium leading-4">
                Description
            </label>
            <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                <textarea
                {...register('description')}
                required
                rows={3}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                />
            </div>

            <button type="submit" disabled={uploading} className="mt-4 px-4 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 sm:max-w-l">{uploading ? 'Uploading...' : 'Create Event'}</button>
        </form>

    );
};

export default CreateEventForm;
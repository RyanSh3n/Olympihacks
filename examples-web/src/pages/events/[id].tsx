import { GetServerSideProps } from 'next';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/firestore';
import Image from 'next/image';

interface Event {
    name: string;
    date: string;
    price: number;
    numTickets: number;
    location: string;
    description: string;
    imageUrl: string;
    timestamp: firebase.firestore.Timestamp;
    href: string;
}

interface EventPageProps {
    event: Event;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id as string;

    const doc = await db.collection('events').doc(id).get();

    if (!doc.exists) {
        return { notFound: true }; // Return a 404 page if the document doesn't exist
    }

    const eventData = doc.data();

    if (!eventData) {
        return { notFound: true };
    }

    const event = {
        ...eventData,
        timestamp: eventData.timestamp.toDate().toISOString(), // Convert Firestore Timestamp to ISO string
    } as unknown as Event;

    return {
        props: {
            event,
        },
    };
};


const EventPage: React.FC<EventPageProps> = ({ event }) => {

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();  // Prevent form from refreshing the page
        console.log('submitted!')
    }

    return (
        <div className='flex flex-col md:flex-row md:space-x-6'>
            <div className="w-full md:w-1/2">
                <img src={event.imageUrl} className='h-64 w-full object-cover md:h-96 md:w-full' />
                <div className="mt-4 flex justify-between">
            <div>
                <h3 className="text-xl text-gray-100">
                    {event.name}
                </h3>
                <p className="mt-1 text-lg text-gray-400">{event.date}</p>
                <p className="mt-1 text-lg text-gray-400">{event.location}</p>
                <p className="mt-1 text-m text-gray-500">{event.description}</p>
            </div>
            <p className="text-xl font-medium text-gray-100">${event.price}</p>
            </div>
            </div>
            <form onSubmit={handleSubmit} className="w-full md:w-1/2 mt-6 md:mt-0">
                <h2 className="text-2xl font-medium  mb-4">Buy a Ticket</h2>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium leading-4 mb-2">
                        Address
                    </label>
                    <input
                        required
                        type="text"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter your address"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium leading-4 mb-2">
                        Number of Tickets
                    </label>
                    <input
                        required
                        type="number"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter number of tickets"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium leading-4 mb-2">
                        Password
                    </label>
                    <input
                        required
                        type="password"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 mt-4">Buy Tickets</button>
                
            </form>
        </div>
    );
};

export default EventPage;
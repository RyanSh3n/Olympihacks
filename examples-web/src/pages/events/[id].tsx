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

    const handleSubmit = () => {
        console.log('submitted!')
    }

    return (
        <div className='flex flex-rows'>
            <div>
                <img src={event.imageUrl} className='w-full' />
                <div className="mt-4 flex justify-between">
            <div>
                <h3 className="text-m text-gray-100">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {event.name}
                </h3>
                <p className="mt-1 text-sm text-gray-400">{event.date}</p>
                <p className="mt-1 text-sm text-gray-400">{event.location}</p>
            </div>
            <p className="text-sm font-medium text-gray-100">{event.price}</p>
            </div>
            </div>
            <form>
                <h2>Buy a Ticket</h2>

                <label htmlFor="title" className="block text-sm font-medium leading-4">
                    Address
                </label>
                <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                    <input
                    required
                    type="text"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    />
                </div>

                <label htmlFor="title" className="block text-sm font-medium leading-4">
                    Password
                </label>
                <div className="flex bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-l">
                    <input
                    required
                    type="text"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    />
                </div>
                <button onClick={handleSubmit}>Buy Tickets</button>
                
            </form>
        </div>
    );
};

export default EventPage;
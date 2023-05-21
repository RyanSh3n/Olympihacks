import { GetServerSideProps } from 'next';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/firestore';
import { sendMessageToAvalanche } from "../../helpers/call-contract";
import { useState } from 'react';
import { useRouter } from 'next/router';


interface Event {
    name: string;
    date: string;
    price: number;
    numTickets: number;
    location: string;
    address: string;
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
    const [messageStatus, setMessageStatus] = useState<string | null>(null);
    const router = useRouter();
    const eventId = router.query.id as string;
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [sentMessage, setSentMessage] = useState<string | null>(null);

    const buyTickets = async (eventId: string, numTicketsBought: number) => {
        // Reference to the event document in Firestore
        const eventRef = db.collection('events').doc(eventId);
    
        // Get the current document
        const doc = await eventRef.get();
    
        // Check if the document exists
        if (!doc.exists) {
            throw new Error('The event does not exist');
        }
    
        const eventData = doc.data();
    
        // Check if the eventData is valid
        if (!eventData) {
            throw new Error('No data available for the event');
        }
    
        // Get the current number of tickets
        const currentNumTickets = eventData.numTickets;
    
        // Check if there are enough tickets available
        if (currentNumTickets < numTicketsBought) {
            throw new Error('Not enough tickets available');
        }
    
        // Calculate the new number of tickets
        const newNumTickets = currentNumTickets - numTicketsBought;
    
        // Update the number of tickets
        await eventRef.update({
            numTickets: newNumTickets,
        });
    };
    
    // You can call the function like this, remember to handle errors with a try/catch block
    // buyTickets(eventId, numTicketsBought);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // Prevent form from refreshing the page
    
        // Generate a random address for the message sender
        const senderAddress = event.address; // assuming 'event' is from your event object, not the form event
        const formData = new FormData(e.currentTarget);
        const receiverAddress = formData.get('address') as string;
        const numTickets = formData.get('numTickets') as unknown as number;
    
        // Construct the message object
        const message = {
            sender: senderAddress,
            recipient: receiverAddress,
            event: {
                name: event.name,
                date: event.date,
                price: event.price,
                numTickets: numTickets,
                location: event.location,
                address: event.address,
                description: event.description,
                imageUrl: event.imageUrl,
                timestamp: event.timestamp,
                href: event.href
            }
        };
        setMessageStatus('Preparing ticket...');
        
        await sendMessageToAvalanche(JSON.stringify(message)).then( async() => {
            setMessageStatus('Ticket purchased successfully!')
            setSentMessage(JSON.stringify(message));
        }).catch((error) => {
            setMessageStatus(`Error sending message: ${error.message}`);
        });
        
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
                        name="address"
                        required
                        type="text"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter your wallet address"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium leading-4 mb-2">
                        Number of Tickets
                    </label>
                    <input
                        required
                        name="address"
                        type="number"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter number of tickets"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 my-4">Buy Tickets</button>
                <div>{messageStatus}</div>
                {sentMessage && <button onClick={() => setModalOpen(true)} className="mt-3 px-3 py-2 rounded-sm border-2 border-zinc-800 text-white hover:bg-indigo-900 hover:border-indigo-400 text-sm">View Ticket</button>}
                {
                    isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2">
                                <button 
                                    onClick={() => setModalOpen(false)}
                                    className="absolute right-3 top-3 text-lg font-bold text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl text-gray-900 font-bold mb-4">Ticket Confirmation</h2>
                                {sentMessage && (
                                    <div className="text-gray-600 space-y-4">
                                        <div>
                                            <span className="font-bold">From:</span> {JSON.parse(sentMessage).sender}
                                        </div>
                                        <div>
                                            <span className="font-bold">To:</span> {JSON.parse(sentMessage).recipient}
                                        </div>
                                        <div>
                                            <span className="font-bold">Event Name:</span> {JSON.parse(sentMessage).event.name}
                                        </div>
                                        <div>
                                            <span className="font-bold">Event Date:</span> {JSON.parse(sentMessage).event.date}
                                        </div>
                                        <div>
                                            <span className="font-bold">Event Location:</span> {JSON.parse(sentMessage).event.location}
                                        </div>
                                    </div>
                                )}
            </div>
        </div>
    )
}



            </form>
        </div>
    );
};

export default EventPage;
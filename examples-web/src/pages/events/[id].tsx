import { GetServerSideProps } from 'next';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { sendTokenToDestChain, generateRecipientAddress } from "../../helpers";
import { useState, useCallback } from 'react';
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
    const [loading, setLoading] = useState(false);
    const [sentTxHash, setSentTxHash] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState(false)
    const router = useRouter();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const receiverAddress = formData.get('address') as string;
        const numTickets = formData.get('numTickets') as unknown as number;
        const senderAddress = event.address; // Assuming 'event' is from your event object, not the form event

        setLoading(true);
        await sendTokenToDestChain((event.price * numTickets).toString(), [receiverAddress], (txhash: string) => {
            setSentTxHash(txhash);

            // Send message back to sender containing event information
            const message = {
                sender: receiverAddress,
                recipient: senderAddress,
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
            // Send the message using your messaging service or communication channel
            sendMessageToSender(JSON.stringify(message));
            setMessage(JSON.stringify(message)); // Set the message state
        }).finally(() => {
            setLoading(false);
        });
    }, [event]);

    // Function to send the message to the sender (update it with your own implementation)
    const sendMessageToSender = (message: string) => {
        console.log('Sending message to sender:', message);
        // Implement the logic to send the message to the sender
    };

    const handleViewTicket = () => {
        setVisible(true)
        console.log('Transaction Hash:', sentTxHash);
    };

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
                        name="numTickets"
                        type="number"
                        className="block flex-1 rounded border-0 bg-gray-800 py-1.5 pl-3 placeholder:text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 focus:outline-none  w-full"
                        placeholder="Enter number of tickets"
                    />
                </div>
                <button type="submit" disabled={loading} className="block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 my-4">
                    {loading ? 'Processing...' : 'Buy Tickets'}
                </button>
                {message && (
                    <button
                        onClick={handleViewTicket}
                        className="block px-4 py-2 border-2 border-zinc-800 text-white hover:bg-indigo-900 hover:border-indigo-400 mt-4"
                    >
                        View Ticket
                    </button>
                )}
                {
                visible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2">
                            <button 
                                onClick={() => setVisible(false)}
                                className="absolute right-3 top-3 text-lg font-bold text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl text-gray-800 font-bold mb-4">Ticket Confirmation</h2>
                {message && (
                    <div className="text-gray-600 space-y-4">
                        <div>
                            <span className="font-bold">From:</span> {JSON.parse(message).sender}
                        </div>
                        <div>
                            <span className="font-bold">To:</span> {JSON.parse(message).recipient}
                        </div>
                        <div>
                            <span className="font-bold">Event Name:</span> {JSON.parse(message).event.name}
                        </div>
                        <div>
                            <span className="font-bold">Event Date:</span> {JSON.parse(message).event.date}
                        </div>
                        <div>
                            <span className="font-bold">Event Location:</span> {JSON.parse(message).event.location}
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
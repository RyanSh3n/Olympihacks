import React, { Key, useEffect, useState } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useRouter } from 'next/router'
import { UrlObject } from 'url';

interface Event {
  [x: string]: Key | null | undefined;
  name: string;
  price: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  href: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter()
  const navigateToPage = (event: { href: string | UrlObject; }) => {
    router.push(event.href)
  }

  useEffect(() => {
    const unsubscribe = db
      .collection('events')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot: { docs: any[]; }) => {
        const fetchedEvents: Event[] = snapshot.docs.map((doc) => {
          return {
            ...(doc.data() as Event),
            id: doc.id,
          };
        });
        setEvents(fetchedEvents);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event.id} className="rounded shadow-md p-6 bg-zinc-800">
          <img src={event.imageUrl} alt={event.name} className="h-64 w-full object-cover rounded-md" />
          <div className="mt-4">
          <div className="mt-4 flex justify-between">
            <div>
                <h3 className="text-lg text-gray-100">
                    {/* <span aria-hidden="true" className="absolute inset-0" /> */}
                    {event.name}
                </h3>
                <p className="mt-1 text-m text-gray-400">{event.date}</p>
                <p className="mt-1 text-m text-gray-400">{event.location}</p>
            </div>
            <p className="text-lg font-medium text-gray-100">${event.price}</p>
            </div>
            <button className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 mt-4' onClick={() => navigateToPage(event)}>Buy Tickets</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
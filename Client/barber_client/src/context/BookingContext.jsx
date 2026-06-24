import { createContext, useContext, useEffect, useState } from "react";

// localStorage key — single source of truth for the booking list.
const STORAGE_KEY = "elite_barber_bookings";

const BookingContext = createContext(null);

// `seed` = initial demo bookings so the Appointments page isn't empty on first visit.
// They're written to localStorage the first time, so they survive refresh too.
const seedBookings = [
  {
    id: "demo-1",
    barber: { id: "1", name: "Marcus Rodriguez", specialty: "Classic Cuts & Beard Styling", rating: 4.9 },
    service: { id: "hair-beard", name: "Haircut + Beard", price: 50, duration: 60 },
    date: addDays(2),
    time: "10:30",
    totalPrice: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    barber: { id: "3", name: "David Chen", specialty: "Precision Cuts & Hair Design", rating: 4.9 },
    service: { id: "hair", name: "Haircut", price: 35, duration: 45 },
    date: addDays(7),
    time: "15:00",
    totalPrice: 35,
    createdAt: new Date().toISOString(),
  },
];

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // localStorage unavailable or corrupt — fall through to seed
  }
  // First visit: write the seed so it's stable across refreshes
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
  return seedBookings;
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(loadBookings);

  // Keep localStorage in sync whenever bookings change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
}
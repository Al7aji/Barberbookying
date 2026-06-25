// Static data used by the Booking and Appointments pages.
// (Mirrors the source project's mockData, kept inline so no extra config needed.)

export const barbers = [
  {
    id: "1",
    name: "Marcus Rodriguez",
    specialty: "Classic Cuts & Beard Styling",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Alessandro Rossi",
    specialty: "Modern Styles & Fades",
    rating: 4.8,
  },
  {
    id: "3",
    name: "David Chen",
    specialty: "Precision Cuts & Hair Design",
    rating: 4.9,
  },
  {
    id: "4",
    name: "James Thompson",
    specialty: "Traditional Barbering",
    rating: 4.7,
  },
];

export const services = [
  { id: "hair",       name: "Haircut",         price: 35, duration: 45 },
  { id: "hair-beard", name: "Haircut + Beard", price: 50, duration: 60 },
];

export const timeSlots = [
  { time: "09:00", available: true  },
  { time: "09:30", available: true  },
  { time: "10:00", available: false },
  { time: "10:30", available: true  },
  { time: "11:00", available: true  },
  { time: "11:30", available: true  },
  { time: "12:00", available: false },
  { time: "12:30", available: true  },
  { time: "13:00", available: true  },
  { time: "13:30", available: true  },
  { time: "14:00", available: true  },
  { time: "14:30", available: false },
  { time: "15:00", available: true  },
  { time: "15:30", available: true  },
  { time: "16:00", available: true  },
  { time: "16:30", available: true  },
  { time: "17:00", available: true  },
  { time: "17:30", available: false },
  { time: "18:00", available: true  },
  { time: "18:30", available: true  },
  { time: "19:00", available: true  },
  { time: "19:30", available: true  },
];
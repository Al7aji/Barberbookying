import { Link } from "react-router-dom";
import { Calendar, Clock, Scissors, Trash2, CalendarPlus } from "lucide-react";
import { useBookings } from "../context/BookingContext";

export default function Appointments() {
  const { bookings, cancelBooking } = useBookings();

  // Sort bookings: upcoming first (by date asc), past last (by date desc)
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = bookings
    .filter((b) => new Date(b.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const past = bookings
    .filter((b) => new Date(b.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // ─── Empty state ───────────────────────────────────────────────────────
  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <Calendar className="size-20 mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold mb-2">No appointments yet</h1>
          <p className="text-gray-600 mb-6">
            Book your first appointment and it will show up here.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <CalendarPlus className="size-4" />
            Book an Appointment
          </Link>
        </div>
      </div>
    );
  }

  // ─── List view ─────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Appointments</h1>
            <p className="text-gray-600">
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm"
          >
            <CalendarPlus className="size-4" />
            New Booking
          </Link>
        </div>

        {upcoming.length > 0 && (
          <Section title="Upcoming">
            {upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={() => cancelBooking(b.id)}
                cancellable
              />
            ))}
          </Section>
        )}

        {past.length > 0 && (
          <Section title="Past">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function BookingCard({ booking, onCancel, cancellable }) {
  const { barber, service, date, time, totalPrice } = booking;
  const dateStr = new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <div className="flex items-start gap-4">
        {/* Date badge */}
        <div className="flex-shrink-0 w-16 h-16 bg-indigo-50 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs uppercase text-indigo-600 font-semibold">
            {new Date(date).toLocaleDateString(undefined, { month: "short" })}
          </span>
          <span className="text-2xl font-bold text-indigo-600 leading-none">
            {new Date(date).getDate()}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Scissors className="size-4 text-gray-400" />
            <h3 className="font-semibold">{barber.name}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-2">{service.name}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {dateStr}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {service.duration} min
            </span>
          </div>
        </div>

        {/* Price + cancel */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-bold">€{totalPrice}</span>
          {cancellable && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              <Trash2 className="size-3.5" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
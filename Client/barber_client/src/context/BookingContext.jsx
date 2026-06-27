import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";
import { barbers as staticBarbers } from "../data/bookingData";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Fetch the list of barbers (used by Booking page)
  const fetchBarbers = useCallback(async () => {
    setLoadingBarbers(true);
    try {
      const { data } = await api.get("/barbers");
      setBarbers(data.barbers || []);
    } catch (e) {
      console.error("fetchBarbers failed, using static data", e);
      setBarbers(staticBarbers);
    } finally {
      setLoadingBarbers(false);
    }
  }, []);

  // Fetch the current user's appointments (used by Appointments page)
  const fetchMyAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get("/appointments/me");
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error("fetchMyAppointments failed", e);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // Get available time slots for a given barber/date/service
  const fetchAvailableSlots = useCallback(async (barberId, date, service) => {
    const { data } = await api.get(
      `/barbers/${barberId}/available-slots`,
      { params: { date, service } }
    );
    return data.slots || [];
  }, []);

  // Create a new appointment
  const createAppointment = useCallback(async ({ barber, service, date, time, notes }) => {
    const { data } = await api.post("/appointments", { 
      barber: barber._id || barber.id, 
      service: service.name, 
      date, 
      time, 
      notes 
    });
    // Prepend the new one to the local list (server returns the full appointment)
    setAppointments((prev) => [data.appointment, ...prev]);
    return data.appointment;
  }, []);

  // Cancel an appointment (sets status to "cancelled" server-side, removes it locally)
  const cancelAppointment = useCallback(async (id) => {
    await api.patch(`/appointments/${id}/cancel`);
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        barbers,
        appointments,
        loadingBarbers,
        loadingAppointments,
        fetchBarbers,
        fetchMyAppointments,
        fetchAvailableSlots,
        createAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
}
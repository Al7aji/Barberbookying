import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Star, Check, CalendarDays, Clock } from "lucide-react";
import { services, timeSlots } from "../data/bookingData";
import { useBookings } from "../context/BookingContext";

export default function Booking() {
  const navigate = useNavigate();
  const { createAppointment, barbers, fetchBarbers, loadingBarbers } = useBookings();

  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const totalPrice = selectedService ? selectedService.price : 0;

  const canGoNext =
    (step === 1 && selectedBarber) ||
    (step === 2 && selectedService) ||
    (step === 3 && selectedDate && selectedTime);

  const handleNext = () => canGoNext && setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleConfirm = async () => {
    try {
      const booking = await createAppointment({
        barber: selectedBarber,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        totalPrice,
      });
      setConfirmation(booking);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedBarber(null);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setConfirmation(null);
  };

  // Today as YYYY-MM-DD for the <input type="date" min={...}>
  const today = new Date().toISOString().slice(0, 10);

  // ─── Confirmation screen ───────────────────────────────────────────────
  if (confirmation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="size-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Appointment Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            We've saved your booking. You can view it anytime in My Appointments.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
            <Row label="Barber"  value={confirmation?.barber?.name || selectedBarber?.name} />
            <Row label="Service" value={confirmation?.service?.name || selectedService?.name} />
            <Row label="Date"    value={confirmation?.date ? new Date(confirmation.date).toLocaleDateString() : new Date(selectedDate).toLocaleDateString()} />
            <Row label="Time"    value={confirmation?.time || selectedTime} />
            <Row label="Total"   value={`€${confirmation?.totalPrice || totalPrice}`} bold />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/appointments")}
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              View My Appointments
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Wizard ─────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Book Your Appointment</h1>
          <p className="text-gray-600 text-lg">
            Choose your barber, service, and preferred time slot
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= n ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > n ? <Check className="size-5" /> : n}
              </div>
              {n < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${step > n ? "bg-indigo-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main step content */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {step === 1 && (
              <Step title="Select Your Barber" subtitle="Choose from our expert team">
                {loadingBarbers ? (
                  <p className="text-gray-500">Loading barbers...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {barbers.map((b) => {
                      const isSelected = selectedBarber && (
                        (selectedBarber._id && selectedBarber._id === b._id) ||
                        (selectedBarber.id && selectedBarber.id === b.id)
                      );
                      return (
                        <button
                          key={b._id || b.id}
                          onClick={() => setSelectedBarber(b)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <Scissors className="size-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{b.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{b.specialty}</p>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{b.rating || 4.5}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="size-5 text-indigo-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Step>
            )}

            {step === 2 && (
              <Step title="Select Service" subtitle="Pick the service you want">
                <div className="space-y-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedService?.id === s.id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-sm text-gray-600">{s.duration} minutes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold">€{s.price}</span>
                          {selectedService?.id === s.id && (
                            <Check className="size-5 text-indigo-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 3 && (
              <Step title="Select Date & Time" subtitle="Pick a slot that works for you">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarDays className="size-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="size-4 inline mr-1" />
                      Time
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`px-2 py-2 rounded-md text-sm border transition-colors ${
                            selectedTime === slot.time
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : slot.available
                              ? "border-gray-300 hover:border-indigo-400"
                              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Step>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!canGoNext}
                  className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <SummaryRow label="Barber"  value={selectedBarber?.name}  placeholder="Not selected" />
                <SummaryRow label="Service" value={selectedService?.name} placeholder="Not selected" />
                <SummaryRow
                  label="Date"
                  value={selectedDate ? new Date(selectedDate).toLocaleDateString() : null}
                  placeholder="Not selected"
                />
                <SummaryRow label="Time"    value={selectedTime || null}  placeholder="Not selected" />
              </div>
              <div className="border-t mt-4 pt-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">€{totalPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Cancellations must be made at least 24 hours in advance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tiny local components ──────────────────────────────────────────────
function Step({ title, subtitle, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-gray-600 text-sm mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, placeholder }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
      <p className={value ? "font-medium" : "text-gray-400 italic"}>{value || placeholder}</p>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
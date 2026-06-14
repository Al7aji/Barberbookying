import { Link } from "react-router-dom";
import { Calendar, Scissors, ShoppingBag, Star, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Elite Barber</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Premium grooming services for the modern gentleman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <button className="inline-flex items-center justify-center rounded-md text-lg px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                <Calendar className="size-5 mr-2" />
                Book Appointment
              </button>
            </Link>
            <Link to="/shop">
              <button className="inline-flex items-center justify-center rounded-md text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white transition-colors">
                <ShoppingBag className="size-5 mr-2" />
                Shop Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect service for your grooming needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Service card: Haircut */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Scissors className="size-6" />
                  Haircut
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Professional haircut tailored to your style
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">45 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-semibold">€35</span>
                </div>
                <Link to="/booking">
                  <button className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors py-2 font-medium">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Service card: Haircut + Beard */}
            <div className="bg-white rounded-lg border-2 border-indigo-600 shadow-sm hover:shadow-lg transition-shadow p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Scissors className="size-6" />
                    Haircut + Beard
                  </h3>
                  <Award className="size-5 text-indigo-600" />
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Complete grooming experience
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-semibold">€50</span>
                </div>
                <Link to="/booking">
                  <button className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors py-2 font-medium">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Elite Barber</h2>
            <p className="text-gray-600 text-lg">
              Experience excellence in every detail
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <Star className="size-12 mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Expert Barbers</h3>
              <p className="text-gray-600">
                Our team consists of highly skilled professionals with years of
                experience in classic and modern barbering techniques.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <Clock className="size-12 mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
              <p className="text-gray-600">
                Book your appointment online at your convenience. Choose your
                preferred barber and time slot with ease.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <ShoppingBag className="size-12 mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
              <p className="text-gray-600">
                Shop our curated selection of professional-grade grooming
                products to maintain your look at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for a Fresh Look?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book your appointment today and experience the Elite Barber
            difference
          </p>
          <Link to="/booking">
            <button className="inline-flex items-center justify-center rounded-md text-lg px-8 py-3 bg-white text-indigo-600 hover:bg-gray-100 transition-colors font-semibold">
              Book Your Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

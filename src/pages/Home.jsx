import React from "react";
import { Link } from "react-router-dom";

// Product images from public folder
const productImages = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/b174943b676c10089baa1595d0ce6f45.jpg",
  "/ab7b312109bf6a0810fcdc2a1c8d4f6d.jpg",
];

const Home = () => {
  const features = [
    {
      icon: "fas fa-hand-sparkles",
      title: "Handcrafted Excellence",
      description:
        "Each pot is meticulously crafted by skilled artisans with decades of experience in traditional cement craft techniques.",
    },
    {
      icon: "fas fa-shield-alt",
      title: "Weatherproof Design",
      description:
        "Engineered to withstand harsh Philippine weather conditions, ensuring your pots maintain beauty for years.",
    },
    {
      icon: "fas fa-leaf",
      title: "Eco-Conscious",
      description:
        "Made with sustainable materials and eco-friendly processes that minimize environmental impact.",
    },
    {
      icon: "fas fa-palette",
      title: "Custom Designs",
      description:
        "Personalized colors, sizes, and patterns to match your unique garden vision.",
    },
  ];

  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "1000+", label: "Happy Customers" },
    { value: "200+", label: "Unique Designs" },
    { value: "10+", label: "Municipalities Served" },
  ];

  const testimonials = [
    {
      name: "Anonymous",
      role: "Homeowner",
      image: "fas fa-user",
      quote:
        "The quality of Jhansel cement pots is unmatched. My garden looks stunning with their beautiful designs!",
      rating: 5,
    },
    {
      name: "Anonymous",
      role: "Landscape Architect",
      image: "fas fa-user",
      quote:
        "I exclusively recommend Jhansel for all my projects. Their attention to detail is remarkable.",
      rating: 5,
    },
    {
      name: "Anonymous",
      role: "Restaurant Owner",
      image: "fas fa-user",
      quote:
        "Transformed our outdoor space with their custom planters. Professional service and premium quality!",
      rating: 5,
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-float">
                <i className="fas fa-star text-yellow-400"></i>
                Premium Quality Manufacturing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow text-white">
                Beautiful Cement Pots for Your Garden
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-xl">
                Transform your outdoor spaces with our handcrafted cement pots.
                Built to last, designed to impress, and crafted with passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn-secondary text-center inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Collection</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link
                  to="/about"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white hover:text-black text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-center inline-flex items-center justify-center"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>

            <div className="relative animate-fadeInRight animation-delay-200">
              <div className="relative">
                <div className="absolute -inset-3 bg-white/10 backdrop-blur-lg rounded-3xl"></div>
                <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-3 shadow-2xl">
                  <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                    <img
                      src={productImages[1]}
                      alt="Featured Product"
                      className="w-full h-full object-contain p-8"
                    />
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">500+</p>
                      <p className="text-xs text-gray-500">Unique Designs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="stat-number">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
              Testimonials
            </span>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mx-auto mt-4">
              Real feedback from satisfied customers across the Philippines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i
                      key={i}
                      className="fas fa-star text-yellow-400 text-sm"
                    ></i>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center mr-3">
                    <i className={`${testimonial.image} text-white text-sm`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-black">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-gradient-warm text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-48 h-48 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-green-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp text-white">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed animate-fadeInUp animation-delay-200">
            Contact us today to discuss your requirements and discover the
            perfect cement pots for your outdoor space. Quality guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-300">
            <Link
              to="/contact"
              className="bg-white text-black hover:bg-gray-100 font-medium py-3 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-envelope mr-2"></i>
              Get In Touch
            </Link>
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white hover:text-black font-medium py-3 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center"
            >
              <span>Browse Products</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

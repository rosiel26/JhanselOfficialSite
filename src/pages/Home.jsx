import React from "react";
import { Link } from "react-router-dom";

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
    { value: "5000+", label: "Happy Customers" },
    { value: "200+", label: "Unique Designs" },
    { value: "50+", label: "Cities Served" },
  ];

  const testimonials = [
    {
      name: "Maria Garcia",
      role: "Homeowner",
      image: "fas fa-user",
      quote:
        "The quality of Jhansel cement pots is unmatched. My garden looks stunning with their beautiful designs!",
      rating: 5,
    },
    {
      name: "Carlos Reyes",
      role: "Landscape Architect",
      image: "fas fa-user",
      quote:
        "I exclusively recommend Jhansel for all my projects. Their attention to detail is remarkable.",
      rating: 5,
    },
    {
      name: "Ana Martinez",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-float">
                🏭 Premium Quality Manufacturing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow">
                Beautiful Cement Pots for Your Garden
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-xl">
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
                  className="bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center inline-flex items-center justify-center"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>

            <div className="relative animate-fadeInRight animation-delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 backdrop-blur-lg rounded-3xl"></div>
                <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary-light/10 rounded-2xl flex items-center justify-center border-2 border-primary/10">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg animate-float">
                        <i className="fas fa-seedling text-6xl text-white"></i>
                      </div>
                      <p className="text-4xl font-bold text-primary">500+</p>
                      <p className="text-gray-600">Unique Designs</p>
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
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Why Choose Us
            </span>
            <h2 className="section-title">Crafted with Care, Built to Last</h2>
            <p className="section-subtitle mx-auto mt-4">
              Experience the difference of premium quality craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon bg-gradient-to-br from-primary to-primary-light text-white">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-dark">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Our Collection
            </span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle mx-auto mt-4">
              Discover our most popular handcrafted cement pot designs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <div
                key={item}
                className="product-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-card-image relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-light/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-seedling text-4xl text-primary"></i>
                    </div>
                  </div>
                  <span className="absolute top-4 left-4 badge badge-primary">
                    Best Seller
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Terracotta Series {item}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Beautiful handcrafted cement pot with traditional terracotta
                    finish, perfect for any garden setting.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ₱{item * 500 + 299}
                    </span>
                    <Link
                      to="/products"
                      className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                    >
                      View Details
                      <i className="fas fa-arrow-right ml-2 text-sm group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              <span>View All Products</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
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
                className="bg-gray-50 rounded-2xl p-8 card-hover"
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
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <i className={`${testimonial.image} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">
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
      <section className="py-24 hero-gradient-soft text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-xl mb-10 text-blue-100 leading-relaxed animate-fadeInUp animation-delay-200">
            Contact us today to discuss your requirements and discover the
            perfect cement pots for your outdoor space. Quality guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-300">
            <Link
              to="/contact"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <span>Get In Touch</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
            <Link
              to="/products"
              className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

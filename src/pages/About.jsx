import React from "react";

const About = () => {
  const values = [
    {
      icon: "fas fa-star",
      title: "Excellence",
      description:
        "We maintain the highest standards in every product we create, ensuring each pot meets our rigorous quality criteria.",
    },
    {
      icon: "fas fa-heart",
      title: "Passion",
      description:
        "Our work is driven by a deep love for craftsmanship and design, evident in every piece we create.",
    },
    {
      icon: "fas fa-handshake",
      title: "Integrity",
      description:
        "We conduct business with honesty and transparency, building lasting relationships with our customers.",
    },
    {
      icon: "fas fa-leaf",
      title: "Sustainability",
      description:
        "We are committed to environmentally friendly practices and sustainable business operations.",
    },
  ];

  const timeline = [
    {
      year: "2010",
      title: "Foundation",
      description:
        "Jhansel Cement Pots Manufacturing was established by Jhansel Rodriguez as a small family business.",
    },
    {
      year: "2015",
      title: "Expansion",
      description:
        "We expanded our operations and moved to a larger facility to meet growing demand.",
    },
    {
      year: "2018",
      title: "Innovation",
      description:
        "Introduced new design techniques and expanded our product line to include modern and contemporary styles.",
    },
    {
      year: "2024",
      title: "Today",
      description:
        "Now serving customers nationwide, recognized as a leader in cement pot manufacturing in the Philippines.",
    },
  ];

  const team = [
    {
      name: "Jhansel Rodriguez",
      role: "Founder & CEO",
      description:
        "With over 15 years of experience in ceramic and cement craftsmanship.",
      icon: "fas fa-user",
    },
    {
      name: "Maria Santos",
      role: "Head Designer",
      description:
        "Creative visionary behind our innovative pot designs and collections.",
      icon: "fas fa-user",
    },
    {
      name: "Juan Dela Cruz",
      role: "Production Manager",
      description:
        "Ensuring quality and efficiency in our manufacturing process.",
      icon: "fas fa-user",
    },
    {
      name: "Lisa Garcia",
      role: "Sales Manager",
      description:
        "Dedicated to providing excellent customer service and satisfaction.",
      icon: "fas fa-user",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeInUp">
            Since 2010
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp animation-delay-200">
            About Jhansel Cement Pots
          </h1>
          <p className="text-xl text-blue-100 animate-fadeInUp animation-delay-300 max-w-2xl mx-auto">
            Crafting quality cement pots with passion, tradition, and modern
            innovation
          </p>
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

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 animate-fadeInLeft">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
                Our Story
              </span>
              <h2 className="section-title">A Journey of Passion & Craftsmanship</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2010 by Jhansel Rodriguez, Jhansel Cement Pots
                Manufacturing started as a small family business in Manila with a
                simple vision: to create beautiful, durable cement pots that
                transform outdoor spaces.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                What began as a passion for crafting pots quickly grew into a
                successful enterprise. Our commitment to quality, attention to
                detail, and dedication to customer satisfaction set us apart.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we are proud to be one of the leading cement pot
                manufacturers in the Philippines, serving both residential and
                commercial customers nationwide. Every pot we create carries the
                legacy of traditional craftsmanship combined with modern
                innovation.
              </p>
            </div>
            <div className="order-1 lg:order-2 animate-fadeInRight">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary-light/10 rounded-2xl flex items-center justify-center border-2 border-primary/10">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                        <i className="fas fa-award text-5xl text-white"></i>
                      </div>
                      <p className="text-2xl font-bold text-primary">14+</p>
                      <p className="text-gray-600">Years of Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-eye text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and recognized brand in cement pot
                manufacturing across Southeast Asia, setting the standard for
                quality, innovation, and customer satisfaction. We envision
                every garden and outdoor space enhanced by our beautiful,
                handcrafted products.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-bullseye text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To craft high-quality, durable, and aesthetically pleasing cement
                pots that enhance outdoor spaces while providing exceptional
                customer service. We are committed to sustainable practices,
                fair pricing, and continuous innovation to meet the evolving
                needs of our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Our Journey
            </span>
            <h2 className="section-title">Milestones & Achievements</h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-primary-light hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <div
                      className={`bg-white rounded-2xl p-6 shadow-lg card-hover ${
                        index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                      }`}
                    >
                      <span className="text-primary font-bold text-4xl mb-2 block">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full items-center justify-center shadow-lg z-10 mx-4">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              What We Stand For
            </span>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle mx-auto mt-4">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon bg-gradient-to-br from-primary to-primary-light text-white">
                  <i className={`${value.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Meet The Team
            </span>
            <h2 className="section-title">Our Dedicated Professionals</h2>
            <p className="section-subtitle mx-auto mt-4">
              The passionate people behind our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary-light/10 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <i className={`${member.icon} text-4xl text-primary`}></i>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-blue-100 mb-8">
            Contact us today to discuss your requirements and discover how we
            can help bring your vision to life.
          </p>
          <a
            href="/contact"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <span>Get In Touch</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;

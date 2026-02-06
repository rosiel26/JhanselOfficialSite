import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Visit Our Shop",
      details: ["123 Cement Pot Street", "Manila, Philippines"],
      subtitle: "Come see our products in person",
    },
    {
      icon: "fas fa-phone-alt",
      title: "Call Us",
      details: ["+63 917 123 4567", "+63 2 8123 4567"],
      subtitle: "Mon - Sat, 8AM - 6PM",
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      details: ["info@jhanselcementpots.com", "sales@jhanselcementpots.com"],
      subtitle: "We reply within 24 hours",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: "unread",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (err) {
      console.error("Error sending message:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">
            Contact Us
          </h1>
          <p
            className="text-xl text-blue-100 animate-fadeInUp animation-delay-200"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Get in touch with us for inquiries, orders, or custom designs
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

      {/* Contact Info & Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold mb-6">Let's Start a Conversation</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We'd love to hear from you! Whether you have a question about our
                products, want to place an order, or just want to say hello,
                we're here to help.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="contact-info-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="contact-info-icon">
                      <i
                        className={`${info.icon} text-primary text-xl transition-colors`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-gray-500 mt-1">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <h3 className="font-semibold text-dark mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {[
                    { icon: "fab fa-facebook-f", href: "#" },
                    { icon: "fab fa-instagram", href: "#" },
                    { icon: "fab fa-twitter", href: "#" },
                    { icon: "fab fa-youtube", href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 animate-scaleIn">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-check text-green-500 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Message Sent Successfully!
                        </h4>
                        <p className="text-green-600">
                          Thank you for your message. We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 animate-scaleIn">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-exclamation text-red-500 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800">
                          Failed to Send Message
                        </h4>
                        <p className="text-red-600">
                          Something went wrong. Please try again later.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="form-input-with-icon"
                          placeholder="John Doe"
                        />
                        <div className="form-icon-container">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="form-input-with-icon"
                          placeholder="john@example.com"
                        />
                        <div className="form-icon-container">
                          <i className="fas fa-envelope text-gray-400"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          className="form-input-with-icon"
                          placeholder="+63 9xx xxx xxxx"
                        />
                        <div className="form-icon-container">
                          <i className="fas fa-phone text-gray-400"></i>
                        </div>
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label htmlFor="subject" className="form-label">
                        Subject *
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="form-input-select-icon"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Product Question">Product Question</option>
                          <option value="Custom Order">Custom Order</option>
                          <option value="Bulk Order">Bulk Order</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="form-icon-container">
                          <i className="fas fa-tag text-gray-400"></i>
                        </div>
                        <div className="form-select-arrow">
                          <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 bg-white resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <i className="fas fa-paper-plane"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Visit Us
            </span>
            <h2 className="section-title">Our Showroom</h2>
            <p className="section-subtitle mx-auto mt-4">
              Come and see our products in person at our Manila showroom
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/10 to-primary-light/10 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-map-marked-alt text-primary text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Jhansel Cement Pots Showroom
                  </h3>
                  <p className="text-gray-600 mb-4">
                    123 Cement Pot Street, Manila, Philippines
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <i className="fas fa-external-link-alt ml-2 text-sm"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Common Questions
            </span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What sizes do you offer?",
                answer:
                  "We offer a wide range of sizes from mini pots (4 inches) to large planters (24 inches). Custom sizes are also available for bulk orders.",
              },
              {
                question: "Can I customize the color of my pots?",
                answer:
                  "Yes! We offer a variety of standard colors and can create custom colors for bulk orders. Contact us for more information on custom colors.",
              },
              {
                question: "Do you deliver nationwide?",
                answer:
                  "Yes, we ship to all provinces in the Philippines. Shipping fees vary based on location and order volume.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for defective items. Please inspect your order upon delivery and report any issues within 7 days.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <i className="fas fa-question-circle text-primary mr-3"></i>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-9">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

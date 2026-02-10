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

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Visit Our Shop",
      details: ["Purok 2, Tinago, Dauis", "Bohol, Philippines"],
      subtitle: "Come see our products in person",
    },
    {
      icon: "fas fa-phone-alt",
      title: "Call Us",
      details: ["0915 426 3145"],
      subtitle: "Mon - Sat, 8AM - 6PM",
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
          <div className="absolute top-10 right-20 w-48 h-48 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-green-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp font-display text-white">
            Contact Us
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 animate-fadeInUp animation-delay-200"
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
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold mb-6 font-display">Let's Start a Conversation</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We'd love to hear from you! Whether you have a question about our
                products, want to place an order, or just want to say hello,
                we're here to help.
              </p>

              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="contact-info-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="contact-info-icon">
                      <i
                        className={`${info.icon} text-xl transition-colors`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-gray-400 mt-1">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <h3 className="font-semibold text-black mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {[
                    { icon: "fab fa-facebook-f", href: "#" },
                    { icon: "fab fa-instagram", href: "#" },
                    { icon: "fab fa-twitter", href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 font-display">Send us a Message</h3>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 animate-scaleIn">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-check text-green-500 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Message Sent Successfully!
                        </h4>
                        <p className="text-green-600 text-sm">
                          Thank you for your message. We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 animate-scaleIn">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-exclamation text-red-500 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800">
                          Failed to Send Message
                        </h4>
                        <p className="text-red-600 text-sm">
                          Something went wrong. Please try again later.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Mary Arc"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="maryarc@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+63 9xx xxx xxxx"
                      />
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Product Question">Product Question</option>
                        <option value="Custom Order">Custom Order</option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="form-input resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3.5 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Send Message</span>
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
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
              Visit Us
            </span>
            <h2 className="section-title">Our Showroom</h2>
            <p className="section-subtitle mx-auto mt-4">
              Come and see our products in person at our Bohol showroom
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-[21/9] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1770698865758!6m8!1m7!1slmSORCfh3jMWMWMQCadlBQ!2m2!1d9.611069553248248!2d123.8316438879047!3f139.96176376100044!4f-0.6642776870685765!5f0.7820865974627469" 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jhansel Cement Pots Showroom Location"
              ></iframe>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-black">
                    Jhansel Cement Pots Showroom
                  </h3>
                  <p className="text-gray-600">
                    Purok 2, Tinago, Dauis, Bohol, Philippines
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Purok+2,+Tinago,+Dauis,+Bohol,+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-directions mr-2"></i>
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-black font-semibold text-sm uppercase tracking-wider mb-2 block">
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
                question: "Do you deliver entire Povince?",
                answer:
                  "No, Shipping fees vary based on location and order volume.",
              },
            
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <i className="fas fa-question-circle text-green-600 mr-3"></i>
                  {faq.question}
                </h3>
                <p className="text-gray-500 pl-9">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

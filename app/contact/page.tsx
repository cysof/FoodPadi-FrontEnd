"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { enqueueSnackbar } from "notistack";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Message sent successfully! We'll get back to you soon.", { variant: "success" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "Failed to send message. Please try again.", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Numbers</h3>
                      <p className="text-gray-600">08163110123</p>
                      <p className="text-gray-600">08155547663</p>
                      <p className="text-gray-600">07080109521</p>
                      <p className="text-gray-600 text-sm mt-1">Mon-Fri, 9am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">farmride@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office Address</h3>
                      <p className="text-gray-600">
                        House 17 Road 251 FHA Guzape,<br />
                        Abuja, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Working Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    <Link href="https://www.facebook.com/profile.php?id=61575881856380" target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Facebook size={18} className="text-gray-600 hover:text-primary" />
                    </Link>
                    <Link href="#" target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Twitter size={18} className="text-gray-600 hover:text-primary" />
                    </Link>
                    <Link href="#" target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Instagram size={18} className="text-gray-600 hover:text-primary" />
                    </Link>
                    <Link href="#" target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Linkedin size={18} className="text-gray-600 hover:text-primary" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Report Issue">Report Issue</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Find Us</h2>
              <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9999999999995!2d7.456789!3d9.076478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b7d8c5e9f2b%3A0x7a2c4e8b1d3f6a9c!2sGuzape%2C%20Abuja!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FarmRide Office Location - House 17 Road 251 FHA Guzape, Abuja"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                House 17 Road 251 FHA Guzape, Abuja, Nigeria
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How quickly do you respond?</h3>
                  <p className="text-gray-600 text-sm">We typically respond within 24-48 hours during business days.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer phone support?</h3>
                  <p className="text-gray-600 text-sm">Yes, phone support is available Monday-Friday, 9am-6pm.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I visit your office?</h3>
                  <p className="text-gray-600 text-sm">Yes, we welcome visitors during working hours at House 17 Road 251 FHA Guzape, Abuja.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How do I report a technical issue?</h3>
                  <p className="text-gray-600 text-sm">Use the contact form and select "Report Issue" as the subject.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;

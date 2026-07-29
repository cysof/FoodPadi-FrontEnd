"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Users, Truck, Shield, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About FarmRide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting farmers, buyers, and transporters to build a sustainable agricultural ecosystem.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To revolutionize agricultural commerce by providing a seamless platform where farmers can sell their produce, 
              buyers can find quality crops, and transporters can connect with both parties to ensure efficient delivery.
            </p>
          </div>

          {/* What We Offer */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">What We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fresh Produce</h3>
                <p className="text-sm text-gray-500">Direct from farmers to your table</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-500">Supporting local farmers and economies</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Logistics</h3>
                <p className="text-sm text-gray-500">Seamless delivery to your doorstep</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-500">Safe and transparent transactions</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">List or Browse</h3>
                <p className="text-sm text-gray-500">Farmers list crops, buyers browse products</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Order & Pay</h3>
                <p className="text-sm text-gray-500">Place orders securely through our platform</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivered</h3>
                <p className="text-sm text-gray-500">Get fresh produce delivered to your location</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose FarmRide?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-gray-600">Quality assured farm produce from verified farmers</p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-gray-600">Competitive pricing with no middlemen</p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-gray-600">Reliable logistics network across Nigeria</p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-gray-600">24/7 customer support</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary rounded-xl shadow-md p-8 text-center text-white">
            <h2 className="text-2xl font-semibold mb-3">Ready to Get Started?</h2>
            <p className="mb-6 opacity-90">Join thousands of users already using FarmRide</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/auth/register"
                className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                href="/marketplace"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;

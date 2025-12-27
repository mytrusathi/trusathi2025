import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-indigo-50 py-12 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600">
            Understanding how we use cookies to improve your experience.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: December 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12 text-gray-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help the website recognize your device and remember your preferences or login status.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">
              Trusathi uses cookies primarily for essential functions. We categorize them as follows:
            </p>
            <ul className="list-disc pl-5 space-y-4">
              <li>
                <strong>Essential Cookies:</strong> These are necessary for the website to function. For example, we use Firebase Authentication cookies to keep you logged in as you navigate between pages. Without these, you would have to log in on every single page.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> These allow us to remember choices you make (such as your search filters) to provide a more personalized experience.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> We may use tools to understand how many people visit our site and which pages are most popular. This data is aggregated and anonymous.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Managing Cookies</h2>
            <p className="mb-4">
              You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <p className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r text-sm">
              <strong>Note:</strong> If you choose to disable cookies, you may not be able to sign in or use the interactive features of Trusathi.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:
              <br />
              <a href="mailto:support@trusathi.com" className="text-indigo-600 hover:underline font-medium">
                support@trusathi.com
              </a>
            </p>
          </section>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link href="/" className="text-indigo-600 font-semibold hover:underline">
                &larr; Back to Home
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
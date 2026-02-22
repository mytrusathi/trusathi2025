// app/privacy/page.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-indigo-50 py-12 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            How we handle your data, photos, and trust.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              At <strong>Trusathi</strong>, we take your privacy seriously. We understand that matrimonial information is sensitive. This Privacy Policy explains what personal data we collect, how we use it, and how we protect it.
            </p>
            <p>
              By using our platform, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identity Data:</strong> Name, email address, phone number, and government ID (for verification purposes only, not displayed publicly).
              </li>
              <li>
                <strong>Profile Data:</strong> Date of birth, religion, caste, education, profession, family details, and photos uploaded for your matrimonial profile.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website, including log files and device information.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. The Role of Group Admins</h2>
            <p className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
              <strong>Important:</strong> Trusathi operates on a community-led model.
            </p>
            <p className="mb-4">
              When you join a community group or upload a profile, you explicitly grant the <strong>Group Admin</strong> of that community access to your data. Group Admins use this information to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verify your identity and family background.</li>
              <li>Approve your profile for listing within the community.</li>
              <li>Facilitate contact between families.</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Note: While we vet our Group Admins, Trusathi cannot guarantee the data security practices of individual admins outside our platform (e.g., if they write down your details offline).
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Visibility of Your Data</h2>
            <p className="mb-4">
              We respect your privacy. Your full profile (including contact details) is <strong>not visible to the public internet</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Public Visitors:</strong> Can only see basic details (Age, Religion, Profession) and blurred/restricted photos.</li>
              <li><strong>Verified Members:</strong> Can see full profiles only after being approved by a Group Admin.</li>
              <li><strong>Contact Details:</strong> Are only shared when mutual interest is expressed or via the Group Admin.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We use industry-standard security measures (such as encryption and secure Firebase authentication) to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data (&quot;Right to be Forgotten&quot;).</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact our support team.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
              <br />
              <a href="mailto:legal@trusathi.com" className="text-indigo-600 hover:underline font-medium">
                legal@trusathi.com
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
// app/terms/page.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | TruSathi',
  description: 'Read the TruSathi Terms and Conditions, including our Limitation of Liability and Authenticity Score Disclaimer.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-indigo-50 pt-24 pb-12 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-700 font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-gray-600">
              Please read these terms carefully before using TruSathi.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: April 2026
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12 text-gray-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to <strong>TruSathi</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, mobile application, and services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform.
            </p>
            <p>
              TruSathi is a community-verified matrimony platform designed to connect individuals for the purpose of marriage through trusted Community Group Admins.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="mb-4">
              To use our Platform, you must represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are at least 18 years of age (if female) or 21 years of age (if male), adhering to the legal marriageable age in India.</li>
              <li>You are legally competent to enter into a valid marriage under the laws applicable to you.</li>
              <li>You are not prohibited by any law from entering into matrimony.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Role of Group Admins</h2>
            <p className="mb-4">
              TruSathi operates on a decentralized model relying on <strong>Group Admins</strong>. By using the service, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Verification:</strong> Group Admins are responsible for verifying the authenticity of the profiles they upload or approve within their community groups.</li>
              <li><strong>Trust:</strong> While TruSathi provides the technology, the primary trust layer resides with the Group Admin. We encourage users to only join groups administered by individuals they know or trust.</li>
              <li><strong>Liability:</strong> TruSathi is an intermediary. We do not personally verify every profile and are not liable for the conduct or accuracy of Group Admins.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts &amp; Security</h2>
            <p className="mb-4">
              You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Code of Conduct</h2>
            <p className="mb-4">Users agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create fake profiles or misrepresent their identity.</li>
              <li>Use the platform for dating, soliciting, or commercial purposes unrelated to matrimony.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Post content that is defamatory, obscene, or offensive.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to terminate accounts that violate these guidelines without prior notice.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. TruSathi does not guarantee that the platform will function without interruption or errors. We do not guarantee a successful match or marriage. Background checks are the responsibility of the users and their families.
            </p>
          </section>

          {/* Section 7 — EXPANDED Limitation of Liability */}
          <section className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">7. Limitation of Liability</h2>
                <p className="text-amber-700 text-sm font-semibold">Please read this section carefully — it defines the boundaries of TruSathi&apos;s legal responsibility.</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>7.1 Platform as Mediator:</strong> TruSathi acts solely as a <em>technology intermediary</em> and a facilitator of connections between individuals. We are NOT a matchmaking agency, NOT a background verification service, and NOT a guarantor of any user&apos;s character, background, or intentions.
              </p>
              <p>
                <strong>7.2 No Guarantee of Accuracy:</strong> We do not independently verify the accuracy, truthfulness, or completeness of any profile information submitted by users or Group Admins. All information is self-declared or admin-facilitated.
              </p>
              <p>
                <strong>7.3 User Responsibility:</strong> <strong>Your safety is your own responsibility.</strong> You are solely responsible for conducting your own due diligence — including but not limited to meeting in safe public places, verifying identities independently, and consulting family members before proceeding with any match.
              </p>
              <p>
                <strong>7.4 Exclusion of Damages:</strong> To the fullest extent permitted by applicable law, TruSathi, its founders, directors, employees, Group Admins, and affiliates shall <em>not</em> be liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Any fraud, deception, or misrepresentation by any user on the platform.</li>
                <li>Any physical, emotional, financial, or reputational harm arising from meetings, conversations, or relationships initiated via TruSathi.</li>
                <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
                <li>Loss of data, privacy breaches attributable to user actions, or unauthorized account access.</li>
              </ul>
              <p>
                <strong>7.5 Cap on Liability:</strong> In any event, TruSathi&apos;s maximum aggregate liability to you for any claim shall not exceed the amount you paid to TruSathi in the twelve (12) months preceding the event giving rise to the claim, or INR 500, whichever is lower.
              </p>
              <p className="text-sm italic text-gray-500 border-t border-amber-200 pt-4 mt-4">
                By using TruSathi, you explicitly acknowledge and agree to this Limitation of Liability. If you do not agree, please cease using the Platform immediately.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:legal@trusathi.com" className="text-indigo-600 hover:underline font-medium">
                legal@trusathi.com
              </a>
            </p>
          </section>

          {/* Section 9 — NEW: Authenticity Score Disclaimer */}
          <section className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="text-indigo-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">9. Authenticity Score — Disclaimer</h2>
                <p className="text-indigo-700 text-sm font-semibold">Understanding what the Authenticity Score means (and does not mean).</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>9.1 What is the Authenticity Score?</strong> The &quot;Authenticity Score&quot; (also displayed as &quot;Profile Strength&quot;) is an internal metric displayed on user profiles. It reflects the <em>degree of information completeness</em> of a profile — nothing more.
              </p>
              <p>
                <strong>9.2 What it measures:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li><strong>Phone Verification (+20 pts):</strong> A valid phone number has been registered for this account.</li>
                <li><strong>Profile Completeness (+20 pts):</strong> Proportional points based on how many profile fields are filled.</li>
                <li><strong>Selfie / Photo Uploaded (+30 pts):</strong> The user has uploaded a selfie or profile photo.</li>
                <li><strong>Admin Screening (+30 pts):</strong> The profile has been manually reviewed and approved by a Group Admin.</li>
              </ul>
              <p className="font-semibold bg-white border border-indigo-200 rounded-2xl p-4 text-sm">
                🔔 <strong>Important:</strong> The Authenticity Score is <em>NOT</em> a character certificate, background check, police verification, or any form of guarantee about a person&apos;s intentions, honesty, or suitability for marriage. A score of 100 does not mean a person is verified or trustworthy in any legal sense.
              </p>
              <p className="text-sm italic text-gray-500">
                TruSathi expressly disclaims any liability arising from reliance on the Authenticity Score when making personal or matrimonial decisions.
              </p>
            </div>
          </section>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                <ArrowLeft size={16} /> Back to Home
            </Link>
            <span className="text-xs text-gray-400">© 2026 TruSathi. All rights reserved.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
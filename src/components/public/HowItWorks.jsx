export default function HowItWorks() {
  const steps = [
    "Create your profile",
    "Get matched securely",
    "Connect with confidence",
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-900">
          How TruSathi Works
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <div className="text-rose-600 text-2xl font-bold">
                {i + 1}
              </div>
              <p className="mt-3 text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

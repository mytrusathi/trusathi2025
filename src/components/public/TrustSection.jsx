export default function TrustSection() {
  const items = [
    { title: "Verified Profiles", desc: "Every profile is manually reviewed." },
    { title: "Privacy Protected", desc: "Contact details stay hidden." },
    { title: "Community Driven", desc: "Real people. Real connections." },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div key={i} className="p-6 rounded-xl shadow-sm border bg-[#FFF7F7]">
            <h3 className="text-xl font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="mt-2 text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { ShieldCheck, MapPinned, Handshake, Headset } from "lucide-react";

const differentiators = [
  {
    icon: ShieldCheck,
    title: "Verified listings",
    description:
      "Every property is checked for clear title documentation before it goes live on the site.",
  },
  {
    icon: MapPinned,
    title: "Local knowledge",
    description:
      "We work only in coastal Karnataka, so we know the streets, the builders, and the paperwork.",
  },
  {
    icon: Handshake,
    title: "Transparent pricing",
    description:
      "The price you see is the price we quote — no hidden charges revealed at the last step.",
  },
  {
    icon: Headset,
    title: "A team that answers",
    description:
      "Call, WhatsApp, or submit an enquiry — a person from our team follows up, not a script.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-b border-stone-200 bg-white py-16 lg:py-24">
      <div className="container-content">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">
            Why buyers work with us
          </h2>
          <p className="mt-4 text-stone-600">
            Real estate decisions are high-stakes. Here is what we do
            differently to make ours easier to trust.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-navy-50 text-navy">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-lg text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

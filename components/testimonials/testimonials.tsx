//import { Quote } from "lucide-react";

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

const emptyTestimonials: Testimonial[] = [
  {
    quote: "",
    name: "",
    detail: "",
  },
  {
    quote: "",
    name: "",
    detail: "",
  },
  {
    quote: "",
    name: "",
    detail: "",
  },
];

export default function Testimonials({
  items = emptyTestimonials,
}: {
  items?: Testimonial[];
}) {
  return (
    <section className="border-b border-stone-200 bg-white py-16 lg:py-24">
      <div className="container-content">
        <h2 className="max-w-md font-display text-3xl text-navy sm:text-4xl">
          What our customers say
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <figure
              key={i}
              className="rounded-sm border border-stone-200 p-6 min-h-[180px]"
            >
              {/* Empty testimonial column */}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
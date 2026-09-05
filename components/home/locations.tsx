import { siteConfig } from "@/lib/config";
import { MapPin } from "lucide-react";

export default function Locations() {
  return (
    <section className="border-b border-navy-700 bg-navy py-16 text-white lg:py-24">
      <div className="container-content">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl">Where we operate</h2>
          <p className="mt-4 text-navy-200">
            We focus deliberately on a small number of regions so we can
            actually know them well.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {siteConfig.locations.map((loc) => (
            <div
              key={loc.city}
              className="rounded-sm border border-navy-600 bg-navy-800/60 p-6"
            >
              <div className="mb-3 flex items-center gap-2 text-gold-400">
                <MapPin size={18} />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {loc.region}
                </span>
              </div>
              <h3 className="font-display text-xl">{loc.city}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">
                {loc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

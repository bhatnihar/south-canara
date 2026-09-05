import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import EnquiryForm from "@/components/enquiry-form/enquiry-form";
import Map from "@/components/map/map";
import { siteConfig, telLink, mailLink, whatsappLink } from "@/lib/config";

export default function ContactSection() {
  const { address } = siteConfig.contact;

  return (
    <section className="container-content grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-20">
      <div className="lg:col-span-5">
        <h2 className="font-display text-3xl text-navy">Get in touch</h2>
        <p className="mt-3 text-stone-600">
          Fill out the form and our team will reach out, or contact us
          directly using the details below.
        </p>

        <ul className="mt-8 space-y-5">
          <li className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy">
              <Phone size={17} />
            </span>
            <div>
              <p className="text-sm text-stone-500">Call</p>
              <a href={telLink()} className="font-medium text-navy hover:text-gold-700">
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy">
              <MessageCircle size={17} />
            </span>
            <div>
              <p className="text-sm text-stone-500">WhatsApp</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-navy hover:text-gold-700"
              >
                Message us
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy">
              <Mail size={17} />
            </span>
            <div>
              <p className="text-sm text-stone-500">Email</p>
              <a href={mailLink()} className="font-medium text-navy hover:text-gold-700">
                {siteConfig.contact.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy">
              <MapPin size={17} />
            </span>
            <div>
              <p className="text-sm text-stone-500">Office</p>
              <p className="font-medium text-navy">
                {address.line1}, {address.line2}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
            </div>
          </li>
        </ul>

        <div className="mt-8">
          <Map latitude={null} longitude={null} label={`${siteConfig.name} Office`} />
        </div>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-7">
        <EnquiryForm />
      </div>
    </section>
  );
}

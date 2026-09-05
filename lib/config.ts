/**
 * Central company configuration.
 *
 * This is the ONLY place placeholder business details should live.
 * Replace the values marked [PLACEHOLDER] with real company information
 * before launch. Everything else in the app reads from here instead of
 * hardcoding phone numbers, addresses, etc. across components.
 *
 * Values here can later be moved into a `company_settings` table if the
 * client wants to edit them from the admin dashboard without a redeploy —
 * the shape is deliberately flat so that migration is a small change.
 */

export const siteConfig = {
  name: "South Canara Real Estate",
  tagline: "Coastal Roots, Lasting Homes.",
  description:
    "South Canara Real Estate helps you discover, evaluate, and move into trusted properties across the coastal Karnataka region — with transparent pricing and a team that answers.",
  url: "https://www.southcanararealestate.com", // [PLACEHOLDER] set to production domain

  contact: {
    phone: "+91 9180208903", // [PLACEHOLDER]
    phoneDisplay: "+91 9180208903", // [PLACEHOLDER]
    whatsappNumber: "+91 9180208903", // [PLACEHOLDER] digits only, country code, no +/spaces
    email: "", // [PLACEHOLDER]
    address: {
      line1: "",
      line2: "",
      city: "Karkala",
      state: "Karnataka",
      pincode: "[574104]",
    },
  },

  social: {
    instagram: "", // [PLACEHOLDER] full URL, leave "" to hide the icon
    facebook: "",
    linkedin: "",
    youtube: "",
  },

  // Cities/regions the company currently operates in. Move this to a
  // `locations` table in Phase 2 if the list needs to change often.
  locations: [
    {
      city: "Mangaluru",
      region: "Dakshina Kannada",
      description:
        "Coastal city living with strong rental demand near IT parks, the port, and Mangaluru's growing suburbs.",
    },
    {
      city: "Udupi",
      region: "Udupi District",
      description:
        "Temple-town charm with steady appreciation, close to Manipal's academic and healthcare hub.",
    },
    {
      city: "Karkala",
      region: "Udupi District",
      description: "Historic town with a mix of heritage properties and new developments, offering a quieter lifestyle.",
      },
  ],

  whatsappMessageTemplate: (propertyName?: string) =>
    propertyName
      ? `Hi, I am interested in ${propertyName}. Could you share more details?`
      : "Hi, I'd like to know more about your available properties.",
};

export const whatsappLink = (propertyName?: string) => {
  const message = encodeURIComponent(
    siteConfig.whatsappMessageTemplate(propertyName)
  );
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${message}`;
};

export const telLink = () => `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
export const mailLink = () => `mailto:${siteConfig.contact.email}`;

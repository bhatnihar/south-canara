# 🏡 South Canara Real Estate

### Coastal Roots, Lasting Homes.

A modern, full-stack real estate platform built for showcasing and managing properties across South Canara. The platform provides a public-facing property marketplace along with a secure admin dashboard for managing property listings, media, publication status, and enquiries.

**Live Website:** https://south-canara.vercel.app/

---

## 📌 Overview

South Canara Real Estate is a production-ready real estate website designed to provide a clean and intuitive experience for property buyers while giving administrators a centralized system to manage listings.

The application supports:

- 🏠 Property listings and detailed property pages
- 🔎 Property discovery and browsing
- 📸 Multiple property images
- 🎥 Property video uploads
- 📐 Floor-plan uploads
- 📄 Brochure uploads
- 🟢 Property publication management
- 🔴 Sold-property management
- 🔄 Restore sold properties
- 📩 Customer enquiries
- 🔐 Secure admin authentication
- 📊 Admin property management dashboard
- 📱 Responsive mobile-friendly UI
- 🚀 Production deployment with Vercel

---

## ✨ Features

### 🌐 Public Website

#### Homepage

The homepage introduces the South Canara Real Estate brand and highlights available properties with a modern, responsive design.

#### Property Listings

Users can browse available properties and access individual property detail pages.

Each property can include:

- Property title
- Location
- Price
- Property type
- Bedrooms
- Bathrooms
- Area
- Description
- Images
- Floor plans
- Videos
- Brochure
- Availability status

#### Property Detail Pages

Every published property has its own dynamic page containing detailed information and media.

Example route:

```text
/properties/[slug]
```

#### Sold Properties

Sold properties are handled separately from available properties.

Once a property is marked as sold:

- It is removed from the publicly available listings
- Its status is changed to `sold_out`
- Its data is retained
- Administrators can restore it later

Public sold-property route:

```text
/sold-properties
```

---

## 🔐 Admin Dashboard

The application includes a dedicated administration area.

### Admin Authentication

Administrators can securely sign in through:

```text
/admin/login
```

Authentication and user management are handled through Supabase.

### Property Management

Administrators can:

- Create new properties
- Edit existing properties
- Publish properties
- Unpublish properties
- Mark properties as sold
- Restore sold properties
- Manage property information
- Upload property media
- Delete uploaded media

### Property Status Management

Properties use explicit status values instead of deleting sold listings.

The application distinguishes between:

```text
Available / Published
        ↓
      Sold
        ↓
   sold_out
```

A sold property can subsequently be restored to an available state.

This preserves historical property data while keeping the public listings accurate.

---

## 📸 Media Management

The property management system supports multiple types of property media.

### Property Images

Administrators can upload multiple images for each property.

### Floor Plans

Floor plans are stored separately from normal property images and can be displayed independently.

### Property Videos

Property videos can be uploaded and associated with individual listings.

### Brochures

PDF brochures can be uploaded for properties and accessed directly from property detail pages.

All media operations use `FormData` for reliable file handling.

---

## 📩 Enquiries

Visitors can submit enquiries through the website.

The system captures customer enquiry information so administrators can manage potential leads through the admin interface.

Admin route:

```text
/admin/leads
```

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 14**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### Backend

- **Next.js Server Actions**
- **Supabase**
- **PostgreSQL**

### Authentication

- **Supabase Authentication**

### Deployment

- **Vercel**
- **GitHub**

### Development Tools

- Git
- GitHub
- npm
- VS Code

---

## 🏗️ Architecture

The project follows a modern Next.js App Router architecture.

```text
                         ┌─────────────────────┐
                         │      Visitors       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js Frontend  │
                         │   React + TypeScript│
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐           ┌──────────────────┐
          │ Public Website   │           │  Admin Dashboard │
          │                  │           │                  │
          │ Properties       │           │ Properties       │
          │ Property Details │           │ Leads            │
          │ Enquiries        │           │ Media Management │
          └────────┬─────────┘           └────────┬─────────┘
                   │                              │
                   └──────────────┬───────────────┘
                                  ▼
                         ┌──────────────────┐
                         │ Server Actions   │
                         │ Next.js Backend  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Supabase      │
                         │                  │
                         │ PostgreSQL       │
                         │ Authentication   │
                         │ Storage          │
                         └──────────────────┘
```

---

## 📁 Project Structure

```text
south-canara/
│
├── app/
│   ├── admin/
│   │   ├── leads/
│   │   ├── login/
│   │   └── properties/
│   │
│   ├── properties/
│   │   └── [slug]/
│   │
│   ├── sold-properties/
│   │
│   ├── about/
│   ├── contact/
│   ├── privacy-policy/
│   ├── terms/
│   │
│   └── actions/
│       └── properties.ts
│
├── components/
│   ├── admin/
│   │   └── property-form/
│   │       └── media-manager.tsx
│   │
│   └── ...
│
├── lib/
│   ├── data/
│   │   └── properties.ts
│   └── supabase/
│
├── types/
│
├── public/
│
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bhatnihar/south-canara.git
```

Navigate into the project:

```bash
cd south-canara
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add the required Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit `.env.local` or expose private credentials in the repository.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

If port 3000 is already in use, Next.js may start on another available port.

---

## 🧪 Production Build

Before deploying, verify that the production build succeeds:

```bash
npm run build
```

Start the production server with:

```bash
npm start
```

A successful build should complete:

```text
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization
```

---

## 🚀 Deployment

The project is deployed using Vercel.

### Deployment Flow

```text
Local Development
       │
       ▼
     Git
       │
       ▼
    GitHub
       │
       ▼
    Vercel
       │
       ▼
 Production Website
```

The `main` branch is connected to the production deployment.

Live website:

https://south-canara.vercel.app/

---

## 🔒 Security Considerations

The project uses Supabase for authentication, database access, and storage.

Important practices include:

- Environment variables are used for Supabase configuration
- Sensitive credentials are not committed to Git
- Admin functionality is separated from public functionality
- Database access is controlled through Supabase policies
- Authentication is required for administrative operations
- Property media operations are handled through server-side actions

---

## 📊 Property Lifecycle

Properties follow a controlled lifecycle:

```text
                ┌───────────────┐
                │  New Property │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Draft      │
                └───────┬───────┘
                        │
                     Publish
                        │
                        ▼
                ┌───────────────┐
                │   Available   │
                └───────┬───────┘
                        │
                    Mark Sold
                        │
                        ▼
                ┌───────────────┐
                │   sold_out    │
                └───────┬───────┘
                        │
                     Restore
                        │
                        ▼
                ┌───────────────┐
                │   Available   │
                └───────────────┘
```

Sold properties are **not deleted**. Their records are retained and can be restored by an administrator.

---

## 📱 Responsive Design

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

The UI adapts to different screen sizes while maintaining usability across public pages and administrative interfaces.

---

## 🗺️ Available Routes

### Public

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/properties` | Property listings |
| `/properties/[slug]` | Property details |
| `/sold-properties` | Sold properties |
| `/about` | About the company |
| `/contact` | Contact and enquiries |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/robots.txt` | Search engine crawler rules |
| `/sitemap.xml` | Website sitemap |

### Admin

| Route | Purpose |
|---|---|
| `/admin/login` | Admin authentication |
| `/admin` | Admin dashboard |
| `/admin/properties` | Property management |
| `/admin/properties/new` | Add new property |
| `/admin/properties/[id]` | Edit property |
| `/admin/leads` | Manage enquiries |

---

## 🧠 Key Technical Highlights

### Next.js App Router

The application uses the Next.js App Router for:

- File-based routing
- Dynamic property pages
- Server-side rendering
- Server actions
- Static generation where appropriate
- Middleware

### TypeScript

TypeScript provides type safety across:

- Property data
- Media objects
- Server actions
- UI components
- Database interactions

### Supabase

Supabase provides:

- PostgreSQL database
- Authentication
- Storage
- Backend infrastructure

### Server Actions

Property-related operations are handled through Next.js server actions, including:

- Creating properties
- Updating properties
- Publishing/unpublishing
- Marking properties as sold
- Restoring properties
- Uploading media
- Deleting media

---

## 🧩 Challenges Solved

During development, several real-world engineering problems were addressed, including:

- Supabase authentication configuration
- Database and storage integration
- Property media uploads
- Image and video handling
- PDF brochure uploads
- Property publication state management
- Sold-property lifecycle management
- Git merge conflicts
- Production build failures
- ESLint validation issues
- Vercel deployment configuration
- Environment variable configuration
- Responsive UI behavior

The project demonstrates the process of taking a full-stack application from local development through Git-based version control to production deployment.

---

## 📈 Future Improvements

Potential future enhancements include:

- Advanced property search and filtering
- Location-based property search
- Google Maps integration
- Property comparison
- Favorites / saved properties
- WhatsApp enquiry integration
- Email notifications for new enquiries
- Analytics dashboard
- SEO improvements for individual properties
- Image optimization and CDN enhancements
- Role-based admin permissions
- Property availability notifications

---

## 👨‍💻 Developer

**Nihar Bhat**

GitHub:  
https://github.com/bhatnihar

Project Repository:  
https://github.com/bhatnihar/south-canara

---

## 📄 License

This project was developed as a real estate web application for South Canara Real Estate.

Unless otherwise specified, the source code and associated assets should not be reused commercially without permission.

---

## ⭐ Project Status

**Status: Completed & Deployed 🚀**

The application has been successfully built, tested, committed to GitHub, and deployed to Vercel.

### Production

🌐 **https://south-canara.vercel.app/**

### Repository

💻 **https://github.com/bhatnihar/south-canara**

---

<p align="center">
  Built with Next.js, TypeScript, Supabase & ❤️
</p>

# **App Name**: ShikshaSetu

## Core Features:

- Material Upload: Admin uploads study material with title, class, and category. App uploads file to Supabase Storage, retrieves the URL, and stores the metadata in the database.
- Category Management: Admin manages (CRUD) categories, which populate filter options on the student view.  Deletion requires confirmation if materials are linked.
- Student Material Filtering: Students filter study materials by class and category, populated dynamically from Supabase.
- Secure Admin Login: Admin login page secured using Supabase Auth, protecting content management functionality.
- Material Download: Students download files directly from Supabase Storage via links embedded in Material Cards.
- Homepage Navigation: The landing page will have easily accessible buttons to take students to their desired class page.

## Style Guidelines:

- Primary color: Deep navy blue (#1A237E) to convey trust and professionalism.
- Background color: Off-white (#F8F9FA) for a clean and readable interface.
- Accent color: Electric blue (#7DF9FF) for interactive elements and highlights.
- Body font: 'PT Sans' sans-serif for its modern look, with a touch of warmth, offering excellent readability in longer texts
- Headline font: 'Playfair' modern serif, high contrast thin-thick lines, paired with 'PT Sans' for body text, resulting in an elegant, high-end feel. 
- Simple, consistent icons for categories and file types, enhancing usability.
- Two-column layout for the main content hub with a sidebar for filters and a grid for material cards.
- Subtle fade-in effects on Material Cards and smooth page transitions using Framer Motion for enhanced user experience.
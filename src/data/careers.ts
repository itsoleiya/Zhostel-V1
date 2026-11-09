/**
 * Careers page content. Job descriptions are DRAFTS for HR to review before launch.
 * To add or remove a job, edit this list (id must be unique, lowercase, dashes only).
 */
export type Job = {
  id: string;
  title: string;
  type: string;
  location: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
};

export const careersIntro = {
  title: "We're hiring!",
  kicker: "Join the Z Hostel team",
  lede: "We're looking for passionate individuals to help us create unforgettable experiences for travelers from all over the world, right in the heart of Poblacion, Makati.",
  hrEmail: "hr@zhostel.com",
};

export const jobs: Job[] = [
  {
    id: "hostel-manager",
    title: "Hostel Manager",
    type: "Full-time",
    location: "Poblacion, Makati",
    summary: "Lead the day-to-day running of Z Hostel and make sure every guest leaves with a great story.",
    responsibilities: [
      "Oversee front desk, housekeeping and maintenance teams",
      "Keep guest satisfaction and online review scores high",
      "Manage staff schedules, training and performance",
      "Control costs and support budgeting and reporting",
      "Make sure the hostel is safe, clean and compliant",
    ],
    qualifications: [
      "At least 3 years of supervisory experience in hotels, hostels or hospitality",
      "Strong leadership, problem-solving and communication skills",
      "Comfortable with property management systems (Cloudbeds is a plus)",
      "Willing to work flexible hours, including weekends and holidays",
    ],
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    type: "Full-time",
    location: "Poblacion, Makati",
    summary: "Keep the hostel, cafe and bar running smoothly and efficiently behind the scenes.",
    responsibilities: [
      "Coordinate daily operations across rooms, food and beverage, and events",
      "Set up and improve processes, checklists and standards",
      "Manage suppliers, inventory and purchasing",
      "Monitor operating costs and prepare reports for management",
      "Work with the Hostel Manager on staffing and guest experience",
    ],
    qualifications: [
      "At least 3 years of operations experience in hospitality or food and beverage",
      "Organized, hands-on and good with numbers",
      "Experience with inventory and POS systems is a plus",
      "Strong leadership and communication skills",
    ],
  },
  {
    id: "sales-reservation-manager",
    title: "Sales & Reservation Manager",
    type: "Full-time",
    location: "Poblacion, Makati",
    summary: "Fill our beds and our event calendar, from solo travelers to group bookings.",
    responsibilities: [
      "Manage reservations, rates and availability across booking channels",
      "Grow direct bookings, group bookings and corporate accounts",
      "Handle inquiries for groups, events and partnerships",
      "Track occupancy, revenue and channel performance",
      "Work with marketing on promotions and campaigns",
    ],
    qualifications: [
      "At least 2 years of experience in hotel or hostel sales or reservations",
      "Familiar with OTAs (Booking.com, Hostelworld, Agoda) and channel managers",
      "Excellent written and spoken English",
      "Target-driven, organized and customer-focused",
    ],
  },
];

/** Shown above the consent checkbox. HR or legal should approve this wording before launch. */
export const privacyNotice = [
  "Flash Packer Inc. (Z Hostel) collects your name, contact details, CV and message only to assess your job application.",
  "Only our HR team and authorized managers can access them. We keep applications for 12 months, then delete them.",
  `You can ask to access, correct or delete your data anytime by emailing ${careersIntro.hrEmail}. This is in line with the Data Privacy Act of 2012.`,
];

export const cvRules = {
  maxBytes: 5 * 1024 * 1024,
  types: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  accept: ".pdf,.doc,.docx",
};

export const applicationStatuses = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
] as const;

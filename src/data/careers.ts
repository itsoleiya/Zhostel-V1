/**
 * Careers page content. Job descriptions are DRAFTS for HR to review before launch.
 * To add or remove a job, edit this list (id must be unique, lowercase, dashes only).
 */
export type JobSection = { heading?: string; items: string[] };
export type Job = {
  id: string;
  title: string;
  /** e.g. "Full-time". Leave empty until HR confirms. */
  type?: string;
  location: string;
  summary?: string;
  responsibilities: JobSection[];
  qualifications: string[];
  competencies?: string[];
};

export const careersIntro = {
  title: "We're hiring!",
  kicker: "Join the Z Hostel team",
  lede: "We're looking for passionate individuals to help us create unforgettable experiences for travelers from all over the world, right in the heart of Poblacion, Makati.",
  hrEmail: "hr@zhostel.com",
};

/* Job details below are from HR's files "HM, S&RM, OM Job Description.docx" (Nov 2026); Operations Manager updated from the _1 revision. */
export const jobs: Job[] = [
  {
    id: "hostel-manager",
    title: "Hostel Manager",
    location: "Poblacion, Makati",
    responsibilities: [
      { heading: "Operations & Guest Services", items: [
        "Supervise the front desk, housekeeping, admin and maintenance operations.",
        "Ensure a clean, safe, and friendly environment for all guests.",
        "Handle reservations, check-ins, check-outs, and guest communications (online and in-person).",
        "Resolve guest issues and complaints with a positive, solutions-oriented approach.",
      ] },
      { heading: "Team Leadership", items: [
        "Train and manage hostel staff, including volunteers and interns.",
        "Schedule staff shifts as needed.",
        "Foster a positive, team-oriented culture with a focus on service and efficiency.",
      ] },
      { heading: "Community & Events", items: [
        "Organize and promote events, tours, and activities to enhance the guest experience.",
        "Build a welcoming community atmosphere for travelers from around the world.",
        "Collaborate with local vendors and tourism operators for partnerships.",
      ] },
      { heading: "Marketing & Bookings", items: [
        "Maintain hostel listings on OTA platforms (e.g., Hostelworld, Agoda and other partners).",
        "Monitor online reviews and respond professionally to guest feedback.",
        "Collaborate on social media, promotions, and brand presence with marketing team (if applicable).",
      ] },
      { heading: "Financial & Inventory Management", items: [
        "Monitor and manage hostel budgets, expenses, and revenue.",
        "Track and order inventory for housekeeping and general supplies.",
        "Ensure accurate records of occupancy, guest feedback, and revenue performance.",
      ] },
      { heading: "Safety & Compliance", items: [
        "Ensure all safety, hygiene, and fire regulations are followed.",
        "Train staff on emergency procedures and hostel policies.",
        "Maintain hostel licenses and necessary government documentation.",
      ] },
    ],
    qualifications: [
      "Bachelor's degree in Hospitality Management, Tourism Management, Business Administration, or a related field is an advantage.",
      "With at least 5 years of experience in hostel, hotel, or hospitality operations, preferably in a supervisory or managerial role.",
      "Strong knowledge of front desk operations, housekeeping, reservations, guest relations, and property management.",
      "Experience managing OTA platforms such as Hostelworld, Agoda, Booking.com, and other online booking channels.",
      "Excellent leadership, communication, interpersonal, and customer service skills.",
      "Ability to handle guest complaints, resolve operational issues, and make sound decisions under pressure.",
      "Knowledge of budgeting, revenue monitoring, inventory control, and basic financial reporting.",
      "Experience in organizing events, activities, and community-building initiatives is an advantage.",
      "Familiarity with social media management, online marketing, and reputation management is a plus.",
      "Knowledge of safety standards, sanitation practices, fire safety regulations, and government compliance requirements.",
      "Highly organized, proactive, flexible, and capable of managing multiple tasks independently.",
      "Willingness to work on shifting schedules, weekends, and holidays as needed.",
    ],
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    location: "Poblacion, Makati",
    summary: "Oversees the overall hostel operations, ensuring operational efficiency, financial performance, service quality, and compliance with company standards. Provides leadership and direction to department managers to achieve business objectives and maintain excellent guest experiences.",
    responsibilities: [
      { heading: "Operations Management and Oversight", items: [
        "Oversee the overall daily operations of the hostel, ensuring all departments function efficiently and in accordance with company policies and standards.",
        "Monitor the performance of the Hostel Manager and other department heads.",
        "Establish operational procedures, service standards, and performance targets.",
        "Identify operational issues and implement solutions to improve productivity and service delivery.",
        "Ensure proper coordination among Front Office, Housekeeping, Food and Beverage, Maintenance, and other operating units.",
      ] },
      { heading: "Business Performance and Financial Management", items: [
        "Monitor operational expenses, departmental budgets, and overall cost efficiency.",
        "Develop strategies to maximize revenue, occupancy, and profitability.",
        "Review operational and financial reports and recommend improvements.",
        "Ensure effective management of resources, supplies, equipment, and inventory.",
        "Monitor key performance indicators (KPIs) and ensure business targets are met.",
      ] },
      { heading: "Guest Experience and Service Quality", items: [
        "Ensure consistent delivery of quality guest service across all departments.",
        "Oversee the resolution of escalated guest complaints and operational concerns.",
        "Monitor guest feedback, online reviews, and satisfaction ratings.",
        "Implement service improvement initiatives to enhance the overall guest experience.",
      ] },
      { heading: "Leadership and People Management", items: [
        "Provide direction, guidance, and support to the Hostel Manager and department heads.",
        "Monitor departmental performance and ensure accountability for assigned responsibilities.",
        "Identify staffing requirements and coordinate with HR on recruitment and manpower planning.",
        "Support employee development, training, and performance management initiatives.",
        "Promote teamwork, discipline, and a culture of service excellence.",
      ] },
      { heading: "Compliance, Safety and Risk Management", items: [
        "Ensure compliance with company policies, government regulations, and operational standards.",
        "Oversee the implementation of safety, security, sanitation, and emergency procedures.",
        "Ensure facilities, equipment, and operating areas are properly maintained.",
        "Identify operational risks and implement preventive measures.",
      ] },
    ],
    qualifications: [
      "Bachelor's degree in Hospitality Management, Business Administration, Tourism Management, or a related field.",
      "At least 5 years of experience in hospitality or hotel operations, preferably in a supervisory or managerial capacity.",
      "Previous experience overseeing multiple departments or business units.",
      "Strong leadership, organizational, and decision-making skills.",
      "Knowledge of hostel/hotel operations, budgeting, cost control, and revenue management.",
      "Excellent communication, problem-solving, and interpersonal skills.",
      "Ability to manage operational priorities and drive business performance.",
    ],
  },
  {
    id: "sales-reservation-manager",
    title: "Sales & Reservation Manager",
    location: "Poblacion, Makati",
    responsibilities: [
      { heading: "Sales and Business Development", items: [
        "Develop sales strategies to increase room bookings, events, and overall resort revenue.",
        "Identify new business opportunities and build relationships with corporate clients, travel agencies, and other partners.",
        "Conduct sales calls, client meetings, negotiations, and networking activities.",
        "Monitor market trends and competitor activities to identify growth opportunities.",
        "Achieve sales targets and revenue goals.",
      ] },
      { heading: "Reservation Operations", items: [
        "Oversee daily reservation operations and ensure accurate booking processing.",
        "Manage room inventory, availability, booking channels, and group reservations.",
        "Ensure proper handling of cancellations, modifications, and special requests.",
        "Maintain accurate reservation records and reports.",
      ] },
      { heading: "Revenue Management", items: [
        "Monitor occupancy, booking trends, and revenue performance.",
        "Recommend room rates, promotions, and packages to maximize revenue.",
        "Analyze sales and reservation reports to improve booking performance.",
      ] },
      { heading: "Team Leadership", items: [
        "Supervise, train, and develop the Sales and Reservations team.",
        "Set performance targets, monitor productivity, and conduct evaluations.",
        "Prepare staff schedules and ensure proper team coordination.",
      ] },
      { heading: "Guest and Client Relations", items: [
        "Maintain strong relationships with VIP guests, repeat clients, and key accounts.",
        "Handle escalated guest concerns and reservation issues.",
        "Ensure guest preferences and special requests are properly coordinated with other departments.",
      ] },
      { heading: "Systems and Process Improvement", items: [
        "Oversee the proper use of reservation systems and booking platforms.",
        "Develop and implement standard operating procedures.",
        "Identify opportunities to improve reservation processes and efficiency.",
      ] },
      { heading: "Coordination and Reporting", items: [
        "Coordinate with Front Office, Marketing, Finance, F&B, and Operations.",
        "Prepare and present regular sales, occupancy, and revenue reports.",
        "Provide recommendations to management for business growth and improved performance.",
      ] },
    ],
    qualifications: [
      "Bachelor's Degree in Hospitality Management, Business Administration, Marketing, Tourism, or a related field.",
      "Minimum of five (5) years of experience in sales, reservations, hotel/resort operations, or a related leadership role.",
      "Proven experience in hospitality sales and revenue generation.",
      "Strong knowledge of reservation systems, booking channels, and revenue management principles.",
      "Excellent leadership, communication, negotiation, and interpersonal skills.",
      "Strong analytical and problem-solving abilities.",
      "Proficient in Microsoft Office applications and hotel/property management systems.",
      "Ability to work flexible hours, including weekends and holidays when necessary.",
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

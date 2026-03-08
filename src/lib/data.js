// ─── Initial seed data ───────────────────────────────────────────────────────

export const BOOKING_STATUS = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In-progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const STATUS_TRANSITIONS = {
  [BOOKING_STATUS.REQUESTED]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
};

export const ROLES = { CUSTOMER: "customer", PROVIDER: "provider", ADMIN: "admin" };

export const initialCategories = [
  { id: "cat1", name: "Plumbing", icon: "🔧", basePrice: 500, description: "Leaks, clogs, installation" },
  { id: "cat2", name: "Electrical", icon: "⚡", basePrice: 700, description: "Wiring, repairs, fittings" },
  { id: "cat3", name: "Cleaning", icon: "🧹", basePrice: 400, description: "Deep clean, regular upkeep" },
  { id: "cat4", name: "Carpentry", icon: "🪚", basePrice: 600, description: "Furniture, repairs, woodwork" },
  { id: "cat5", name: "Painting", icon: "🎨", basePrice: 450, description: "Interior & exterior painting" },
  { id: "cat6", name: "AC Repair", icon: "❄️", basePrice: 800, description: "Servicing, installation, gas refill" },
  { id: "cat7", name: "Pest Control", icon: "🐛", basePrice: 1200, description: "Cockroach, termite, rodent" },
  { id: "cat8", name: "Gardening", icon: "🌿", basePrice: 350, description: "Trimming, planting, lawn care" },
];

export const initialUsers = [
  {
    id: "u1", name: "Rahul Sharma", email: "rahul@example.com", password: "password",
    role: ROLES.CUSTOMER, city: "Mumbai", avatar: null,
  },
  {
    id: "u2", name: "Priya Singh", email: "priya@example.com", password: "password",
    role: ROLES.CUSTOMER, city: "Delhi", avatar: null,
  },
  {
    id: "u3", name: "Amit Kumar", email: "amit@example.com", password: "password",
    role: ROLES.PROVIDER, city: "Mumbai", avatar: null,
    profile: {
      bio: "Expert plumber with 10 years experience",
      categoryIds: ["cat1", "cat3"],
      experience: 10,
      isAvailable: true,
      isApproved: true,
      rating: 4.5,
      reviewCount: 24,
      areas: ["Andheri", "Bandra", "Juhu"],
    },
  },
  {
    id: "u4", name: "Sunita Devi", email: "sunita@example.com", password: "password",
    role: ROLES.PROVIDER, city: "Delhi", avatar: null,
    profile: {
      bio: "Professional cleaner and home organiser",
      categoryIds: ["cat3", "cat5"],
      experience: 6,
      isAvailable: true,
      isApproved: true,
      rating: 4.8,
      reviewCount: 41,
      areas: ["Connaught Place", "Lajpat Nagar", "Saket"],
    },
  },
  {
    id: "u5", name: "Vikram Reddy", email: "vikram@example.com", password: "password",
    role: ROLES.PROVIDER, city: "Bangalore", avatar: null,
    profile: {
      bio: "Certified electrician, residential & commercial",
      categoryIds: ["cat2", "cat6"],
      experience: 8,
      isAvailable: false,
      isApproved: false,
      rating: 0,
      reviewCount: 0,
      areas: ["Koramangala", "Indiranagar"],
    },
  },
  {
    id: "admin1", name: "Admin User", email: "admin@example.com", password: "admin",
    role: ROLES.ADMIN, city: "", avatar: null,
  },
];

export const initialBookings = [
  {
    id: "b1",
    customerId: "u1",
    providerId: "u3",
    categoryId: "cat1",
    status: BOOKING_STATUS.COMPLETED,
    address: "102 Seaside Apartments, Andheri West, Mumbai",
    city: "Mumbai",
    date: "2026-02-20",
    time: "10:00",
    notes: "Leaking pipe under kitchen sink",
    price: 650,
    images: [],
    workNotes: "Fixed the pipe joint, replaced washer",
    beforeImages: [],
    afterImages: [],
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "b2",
    customerId: "u1",
    providerId: "u3",
    categoryId: "cat3",
    status: BOOKING_STATUS.CONFIRMED,
    address: "102 Seaside Apartments, Andheri West, Mumbai",
    city: "Mumbai",
    date: "2026-03-10",
    time: "09:00",
    notes: "Full house deep cleaning before Holi",
    price: 1200,
    images: [],
    workNotes: "",
    beforeImages: [],
    afterImages: [],
    createdAt: "2026-03-05T11:00:00Z",
    updatedAt: "2026-03-05T15:00:00Z",
  },
  {
    id: "b3",
    customerId: "u2",
    providerId: "u4",
    categoryId: "cat5",
    status: BOOKING_STATUS.IN_PROGRESS,
    address: "45 Green Enclave, Lajpat Nagar, Delhi",
    city: "Delhi",
    date: "2026-03-08",
    time: "11:00",
    notes: "Living room & 2 bedrooms painting, light cream colour",
    price: 4500,
    images: [],
    workNotes: "Started with living room, primer applied",
    beforeImages: [],
    afterImages: [],
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-08T11:30:00Z",
  },
];

export const initialReviews = [
  {
    id: "r1",
    bookingId: "b1",
    customerId: "u1",
    providerId: "u3",
    rating: 5,
    comment: "Excellent work! Fixed the leak quickly and cleaned up afterwards. Highly recommended.",
    isApproved: true,
    createdAt: "2026-02-21T10:00:00Z",
  },
];

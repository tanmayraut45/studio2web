// CRM leads + pipeline. Sources, scoring, conversion. Won leads become clients.

export const leadStages = [
  "New", "Contacted", "Meeting Scheduled", "Proposal Sent",
  "Negotiation", "Won", "Lost", "On Hold",
];

export const leads = [
  { id: "l1", name: "Sneha Kulkarni", phone: "+91 98765 30001", email: "sneha.k@gmail.com", location: "Baner, Pune", budget: 3500000, propertyType: "3BHK Apartment", requirement: "Full Interior", source: "Instagram", style: "Minimal", timeline: "3 months", stage: "New", score: 72, owner: "e4", lastTouch: "2026-06-08", value: 3500000 },
  { id: "l2", name: "Rahul Bansal", phone: "+91 98765 30002", email: "rahul.bansal@corp.in", location: "Andheri, Mumbai", budget: 12000000, propertyType: "Office 4000 sqft", requirement: "Commercial Fit-out", source: "Referral", style: "Corporate", timeline: "6 months", stage: "Proposal Sent", score: 88, owner: "e2", lastTouch: "2026-06-07", value: 12000000 },
  { id: "l3", name: "Fatima Sheikh", phone: "+91 98765 30003", email: "fatima.s@outlook.com", location: "Kalyani Nagar, Pune", budget: 6800000, propertyType: "Villa", requirement: "Turnkey", source: "Website", style: "Contemporary", timeline: "8 months", stage: "Negotiation", score: 91, owner: "e1", lastTouch: "2026-06-08", value: 6800000 },
  { id: "l4", name: "Arjun Reddy", phone: "+91 98765 30004", email: "arjun.reddy@gmail.com", location: "Hitech City, Hyderabad", budget: 4200000, propertyType: "Penthouse", requirement: "Interior + Vastu", source: "Meta Ads", style: "Luxury", timeline: "5 months", stage: "Meeting Scheduled", score: 79, owner: "e4", lastTouch: "2026-06-06", value: 4200000 },
  { id: "l5", name: "Deepa Menon", phone: "+91 98765 30005", email: "deepa.menon@gmail.com", location: "Whitefield, Bengaluru", budget: 2800000, propertyType: "2BHK", requirement: "Modular Kitchen + Living", source: "WhatsApp", style: "Scandinavian", timeline: "2 months", stage: "Contacted", score: 64, owner: "e8", lastTouch: "2026-06-05", value: 2800000 },
  { id: "l6", name: "Vivek Khanna", phone: "+91 98765 30006", email: "vivek.khanna@biz.in", location: "Viman Nagar, Pune", budget: 9500000, propertyType: "Restaurant", requirement: "Hospitality Design", source: "Google Ads", style: "Industrial", timeline: "4 months", stage: "Proposal Sent", score: 83, owner: "e2", lastTouch: "2026-06-07", value: 9500000 },
  { id: "l7", name: "Anjali Saxena", phone: "+91 98765 30007", email: "anjali.s@gmail.com", location: "Powai, Mumbai", budget: 5500000, propertyType: "3BHK Sea-facing", requirement: "Full Interior", source: "Instagram", style: "Coastal", timeline: "6 months", stage: "Negotiation", score: 86, owner: "e4", lastTouch: "2026-06-08", value: 5500000 },
  { id: "l8", name: "Mohan Pillai", phone: "+91 98765 30008", email: "mohan.pillai@gmail.com", location: "Wakad, Pune", budget: 1800000, propertyType: "1BHK", requirement: "Compact Interior", source: "Referral", style: "Minimal", timeline: "1 month", stage: "On Hold", score: 48, owner: "e8", lastTouch: "2026-05-30", value: 1800000 },
  { id: "l9", name: "Tata Realty (Phase 3)", phone: "+91 98765 30009", email: "design@tatarealty.in", location: "Pune", budget: 35000000, propertyType: "Sample Flats x6", requirement: "Show-flat Interiors", source: "Referral", style: "Premium", timeline: "10 months", stage: "Won", score: 95, owner: "e1", lastTouch: "2026-06-01", value: 35000000 },
  { id: "l10", name: "Karthik Iyer", phone: "+91 98765 30010", email: "karthik.iyer@gmail.com", location: "Adyar, Chennai", budget: 3200000, propertyType: "Duplex", requirement: "Interior", source: "Website", style: "Modern", timeline: "4 months", stage: "Lost", score: 41, owner: "e8", lastTouch: "2026-05-22", value: 3200000, lostReason: "Budget mismatch" },
];

export const leadActivity = [
  { id: "la1", lead: "l3", type: "call", note: "Discussed material upgrade; sending revised quote.", by: "e1", time: "2h ago" },
  { id: "la2", lead: "l7", type: "site-visit", note: "Site measurement done. Client liked coastal mood board.", by: "e4", time: "5h ago" },
  { id: "la3", lead: "l2", type: "proposal", note: "Proposal v2 shared over email.", by: "e2", time: "1d ago" },
  { id: "la4", lead: "l1", type: "whatsapp", note: "Auto follow-up sent: brochure + portfolio link.", by: "system", time: "1d ago" },
];

export const leadFunnel = [
  { stage: "New", count: 1, value: 3500000 },
  { stage: "Contacted", count: 1, value: 2800000 },
  { stage: "Meeting", count: 1, value: 4200000 },
  { stage: "Proposal", count: 2, value: 21500000 },
  { stage: "Negotiation", count: 2, value: 12300000 },
  { stage: "Won", count: 1, value: 35000000 },
];

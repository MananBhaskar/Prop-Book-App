// ─── Storage Keys ──────────────────────────────────────────────────────────────
export const STORAGE_KEY = "propbook-properties";
export const LOG_KEY = "propbook-activity";

// ─── Property Type Configuration ───────────────────────────────────────────────
export const TYPE_COLORS = {
    Kothi: { bg: "#FFF3E0", text: "#E65100", icon: "🏠" },
    Flat: { bg: "#E3F2FD", text: "#0D47A1", icon: "🏢" },
    Plot: { bg: "#E8F5E9", text: "#1B5E20", icon: "🟫" },
    Showroom: { bg: "#F3E8FF", text: "#6B21A8", icon: "🏪" },
};

export const PROPERTY_TYPES = ["Flat", "Kothi", "Plot", "Showroom"];

// ─── Status Configuration ──────────────────────────────────────────────────────
export const STATUS_CFG = {
    Available: { bg: "#DCFCE7", text: "#15803D" },
    Sold: { bg: "#FEE2E2", text: "#DC2626" },
    "On Hold": { bg: "#FEF9C3", text: "#CA8A04" },
};

export const STATUS_LIST = ["Available", "On Hold", "Sold"];

// ─── Price Units ───────────────────────────────────────────────────────────────
export const PRICE_UNITS = ["Lakh", "Cr"];
export const MAX_MEDIA_FILES = 20;

// ─── Blank Form Template ───────────────────────────────────────────────────────
export const BLANK_FORM = {
    type: "Flat",
    title: "",
    area: "",
    price: "",
    priceUnit: "Lakh",
    size: "",
    bedrooms: "",
    bathrooms: "",
    floorArea: "",
    facing: "",
    status: "Available",
    contact: "",
    notes: "",
    imageUrl: "",
    mediaFiles: [],
};

// ─── Activity Log Limit ────────────────────────────────────────────────────────
export const MAX_ACTIVITY_ENTRIES = 100;

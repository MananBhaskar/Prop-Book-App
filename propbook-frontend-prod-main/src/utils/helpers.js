/**
 * Returns a locale-formatted timestamp string (en-IN).
 * @returns {string}
 */
export function now() {
    return new Date().toLocaleString("en-IN");
}

/**
 * Generates a simple unique ID based on timestamp + random suffix.
 * @returns {string}
 */
export function uid() {
    return Date.now() + Math.random().toString(36).slice(2, 6);
}

/**
 * Normalizes legacy single-image properties and newer multi-file properties.
 * @param {Object} property
 * @returns {Array<{url: string, kind: "image" | "pdf", name?: string}>}
 */
export function normalizePropertyMedia(property) {
    const media = Array.isArray(property?.mediaFiles) ? property.mediaFiles : [];
    const normalized = media
        .filter((item) => item?.url)
        .map((item) => ({
            url: item.url,
            kind: item.kind === "pdf" ? "pdf" : "image",
            name: item.name || item.originalName || "",
        }));

    if (
        property?.imageUrl &&
        !normalized.some((item) => item.url === property.imageUrl)
    ) {
        normalized.unshift({
            url: property.imageUrl,
            kind: "image",
            name: "Property image",
        });
    }

    return normalized;
}

/**
 * Splits mixed property media into image and PDF groups.
 * @param {Array<{url: string, kind: string, name?: string}>} media
 * @returns {{images: Array, pdfs: Array}}
 */
export function splitPropertyMedia(media) {
    return {
        images: media.filter((item) => item.kind === "image"),
        pdfs: media.filter((item) => item.kind === "pdf"),
    };
}

/**
 * Builds a WhatsApp share URL for a property listing.
 * @param {Object} property
 * @returns {string}
 */
export function buildWhatsAppUrl(property) {
    const p = property;
    const typeIcon = { Kothi: "House", Flat: "Building", Plot: "Plot", Showroom: "Shop" }[p.type] || "House";
    const statusIcon = { Available: "Available", Sold: "Sold", "On Hold": "On Hold" }[p.status] || "Available";
    const pdfCount = normalizePropertyMedia(p).filter((item) => item.kind === "pdf").length;

    const details = p.type === "Showroom"
        ? [
            p.size && `Plot Size: ${p.size}`,
            p.floorArea && `Floor Area: ${p.floorArea}`,
            p.facing && `Facing: ${p.facing}`,
        ].filter(Boolean).join("\n")
        : [
            p.size && `Size: ${p.size}`,
            p.bedrooms && p.bedrooms !== "-" && `Bedrooms: ${p.bedrooms}`,
            p.bathrooms && p.bathrooms !== "-" && `Bathrooms: ${p.bathrooms}`,
        ].filter(Boolean).join("\n");

    const msg = [
        `${typeIcon} ${p.type} for Sale`,
        "",
        `${p.title}`,
        `Location: ${p.area}`,
        `Price: Rs${p.price} ${p.priceUnit}`,
        `Status: ${statusIcon}`,
        details,
        p.notes && `Notes: ${p.notes}`,
        p.contact && `Contact: ${p.contact}`,
        pdfCount ? `Documents: ${pdfCount} PDF file${pdfCount > 1 ? "s" : ""} available` : "",
        "",
        "Shared via PropBook",
    ].filter((line) => line !== false && line !== undefined && line !== "").join("\n");

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

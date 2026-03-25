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
 * Builds a stable public link to a property details page.
 * @param {Object} property
 * @returns {string}
 */
export function buildPropertyPublicUrl(property) {
    const origin = window.location.origin;
    return `${origin}/#/property/${encodeURIComponent(property.id)}`;
}

/**
 * Builds the text payload used by WhatsApp share.
 * @param {Object} property
 * @returns {string}
 */
export function buildPropertyShareText(property) {
    const p = property;
    const typeIcon = { Kothi: "House", Flat: "Building", Plot: "Plot", Showroom: "Shop" }[p.type] || "House";
    const statusIcon = { Available: "Available", Sold: "Sold", "On Hold": "On Hold" }[p.status] || "Available";
    const media = normalizePropertyMedia(p);
    const imageUrls = media
        .filter((item) => item.kind === "image")
        .map((item) => item.url);
    const pdfUrls = media
        .filter((item) => item.kind === "pdf")
        .map((item) => item.url);

    const primaryImageUrl = imageUrls[0] || "";
    const publicUrl = buildPropertyPublicUrl(p);

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

    return [
        primaryImageUrl,
        "",
        `${typeIcon} ${p.type} for Sale`,
        "",
        `${p.title}`,
        `Location: ${p.area}`,
        `Price: Rs${p.price} ${p.priceUnit}`,
        `Status: ${statusIcon}`,
        details,
        p.notes && `Notes: ${p.notes}`,
        p.contact && `Contact: ${p.contact}`,
        "",
        `View photos: ${publicUrl}`,
        pdfUrls.length ? `Documents: ${pdfUrls.length} PDF file${pdfUrls.length > 1 ? "s" : ""} available` : "",
        "",
        "Shared via PropBook",
    ].filter((line) => line !== false && line !== undefined && line !== "").join("\n");
}

/**
 * Builds a WhatsApp share URL for a property listing.
 * @param {Object} property
 * @returns {string}
 */
export function buildWhatsAppUrl(property) {
    return `https://wa.me/?text=${encodeURIComponent(buildPropertyShareText(property))}`;
}

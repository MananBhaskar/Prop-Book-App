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
 * Builds a WhatsApp share URL for a property listing.
 * @param {Object} property
 * @returns {string}
 */
export function buildWhatsAppUrl(property) {
    const p = property;
    const typeIcon = { Kothi: "🏠", Flat: "🏢", Plot: "🟫", Showroom: "🏪" }[p.type] || "🏠";
    const statusIcon = { Available: "✅", Sold: "❌", "On Hold": "⏸️" }[p.status] || "✅";

    const details = p.type === "Showroom"
        ? [
            p.size && `📐 Plot Size: ${p.size}`,
            p.floorArea && `🏗️ Floor Area: ${p.floorArea}`,
            p.facing && `🧭 Facing: ${p.facing}`,
        ].filter(Boolean).join("\n")
        : [
            p.size && `📐 Size: ${p.size}`,
            p.bedrooms && p.bedrooms !== "-" && `🛏️ Bedrooms: ${p.bedrooms}`,
            p.bathrooms && p.bathrooms !== "-" && `🚿 Bathrooms: ${p.bathrooms}`,
        ].filter(Boolean).join("\n");

    const msg = [
        `${typeIcon} *${p.type} for Sale*`,
        ``,
        `🏷️ *${p.title}*`,
        `📍 Location: ${p.area}`,
        `💰 Price: ₹${p.price} ${p.priceUnit}`,
        `${statusIcon} Status: ${p.status}`,
        details,
        p.notes && `📝 Notes: ${p.notes}`,
        p.contact && `📞 Contact: ${p.contact}`,
        ``,
        `_Shared via PropBook_`,
    ].filter(line => line !== false && line !== undefined && line !== "").join("\n");

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

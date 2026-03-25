import WhatsAppIcon from "./WhatsAppIcon";

/**
 * View-only detail modal for a single property.
 */
export default function PropertyViewModal({
    property: p,
    onClose,
    onEdit,
    onShare,
    onDelete,
}) {
    const detailRows = [
        { l: "Status", v: p.status },
        { l: "Size", v: p.size || "—" },
        ...(p.type === "Showroom"
            ? [
                { l: "Floor Area", v: p.floorArea || "—" },
                { l: "Road Facing", v: p.facing || "—" },
            ]
            : [
                { l: "Bedrooms", v: p.bedrooms && p.bedrooms !== "-" ? p.bedrooms : "N/A" },
                { l: "Bathrooms", v: p.bathrooms && p.bathrooms !== "-" ? p.bathrooms : "N/A" },
            ]),
        { l: "Contact", v: p.contact || "—" },
        { l: "Added by", v: p.addedBy || "—" },
        { l: "Date", v: p.date || "—" },
        { l: "Notes", v: p.notes || "—" },
    ];

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
            <div style={{
                background: "#fff", borderRadius: 18, width: "100%", maxWidth: 440,
                boxShadow: "0 24px 70px rgba(0,0,0,0.3)", overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    background: "linear-gradient(135deg,#0f2027,#0f3460)",
                    padding: "20px 22px",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ color: "#94a3b8", fontSize: 13 }}>{p.type}</div>
                            <div style={{ color: "#fff", fontWeight: 900, fontSize: 19, marginTop: 2 }}>
                                {p.title}
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 3 }}>📍 {p.area}</div>
                        </div>
                        <button onClick={onClose} style={{
                            background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                            borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 17,
                        }}>✕</button>
                    </div>
                    <div style={{ color: "#e94560", fontSize: 26, fontWeight: 900, marginTop: 12 }}>
                        ₹{p.price}{" "}
                        <span style={{ fontSize: 15, color: "#94a3b8" }}>{p.priceUnit}</span>
                    </div>
                </div>

                {/* Detail rows */}
                <div style={{ padding: "18px 22px" }}>
                    {p.imageUrl && (
                        <img
                            src={p.imageUrl}
                            alt={p.title}
                            style={{
                                width: "100%", height: 220, objectFit: "cover",
                                borderRadius: 14, marginBottom: 16,
                            }}
                        />
                    )}
                    {detailRows.map((r) => (
                        <div key={r.l} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14,
                        }}>
                            <span style={{ color: "#94a3b8", fontWeight: 600 }}>{r.l}</span>
                            <span style={{
                                color: "#1a1a2e", fontWeight: 700, textAlign: "right", maxWidth: "60%",
                            }}>
                                {r.v}
                            </span>
                        </div>
                    ))}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button onClick={() => onEdit(p)} style={{
                            flex: 1, padding: "11px", background: "#0f3460", color: "#fff",
                            border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                        }}>Edit</button>

                        <button onClick={() => onShare(p)} style={{
                            flex: 1, padding: "11px", background: "#dcfce7", color: "#15803d",
                            border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 7, fontSize: 14,
                        }}>
                            <WhatsAppIcon size={17} />
                            Share
                        </button>

                        <button onClick={() => onDelete(p)} style={{
                            flex: 1, padding: "11px", background: "#fff0f0", color: "#dc2626",
                            border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                        }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

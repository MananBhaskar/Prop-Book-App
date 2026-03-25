import { TYPE_COLORS, STATUS_CFG } from "../utils/constants";
import WhatsAppIcon from "./WhatsAppIcon";

/**
 * Single property card with type badge, price, quick status toggle, and action buttons.
 */
export default function PropertyCard({
    property: p,
    onView,
    onEdit,
    onDelete,
    onStatusChange,
    onShare,
}) {
    const tc = TYPE_COLORS[p.type] || TYPE_COLORS.Flat;
    const sc = STATUS_CFG[p.status] || STATUS_CFG.Available;

    return (
        <div
            style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden",
                transition: "transform .15s,box-shadow .15s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
            }}
        >
            {p.imageUrl && (
                <img
                    src={p.imageUrl}
                    alt={p.title}
                    style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
                />
            )}
            {/* Card header */}
            <div style={{
                background: `linear-gradient(135deg,${tc.bg},#fff)`,
                padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{
                        background: tc.bg, color: tc.text, fontSize: 12, fontWeight: 700,
                        borderRadius: 6, padding: "3px 9px", border: `1px solid ${tc.text}22`,
                    }}>
                        {tc.icon} {p.type}
                    </span>
                    <span style={{
                        background: sc.bg, color: sc.text, fontSize: 12,
                        fontWeight: 700, borderRadius: 6, padding: "3px 9px",
                    }}>
                        {p.status}
                    </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 9, color: "#1a1a2e", lineHeight: 1.3 }}>
                    {p.title}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>📍 {p.area}</div>
            </div>

            {/* Card body */}
            <div style={{ padding: "11px 16px" }}>
                {/* Price + size */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#0f3460" }}>
                        ₹{p.price}{" "}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{p.priceUnit}</span>
                    </span>
                    <span style={{
                        fontSize: 13, color: "#64748b", background: "#f8fafc",
                        borderRadius: 7, padding: "3px 9px",
                    }}>
                        {p.size}
                    </span>
                </div>

                {/* Details row */}
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                    {p.type === "Showroom" ? (
                        <>
                            {p.floorArea && <span>📐 {p.floorArea}</span>}
                            {p.facing && <span>🧭 {p.facing}</span>}
                            {p.contact && <span>📞 {p.contact}</span>}
                        </>
                    ) : (
                        <>
                            {p.bedrooms && p.bedrooms !== "-" && <span>🛏 {p.bedrooms} Bed</span>}
                            {p.bathrooms && p.bathrooms !== "-" && <span>🚿 {p.bathrooms} Bath</span>}
                            {p.contact && <span>📞 {p.contact}</span>}
                        </>
                    )}
                </div>

                {p.addedBy && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 7 }}>
                        Added by: <b>{p.addedBy}</b>
                    </div>
                )}

                {/* Quick status toggle */}
                <div style={{ display: "flex", gap: 5, marginBottom: 9 }}>
                    {["Available", "On Hold", "Sold"].map((s) => (
                        <button key={s} onClick={() => onStatusChange(p, s)} style={{
                            flex: 1, padding: "5px 3px", fontSize: 10, fontWeight: 700,
                            borderRadius: 7, border: "1.5px solid", cursor: "pointer",
                            transition: "all .15s",
                            borderColor: p.status === s ? STATUS_CFG[s].text : "#e2e8f0",
                            background: p.status === s ? STATUS_CFG[s].bg : "#f8fafc",
                            color: p.status === s ? STATUS_CFG[s].text : "#94a3b8",
                        }}>
                            {s}
                        </button>
                    ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => onView(p)} style={{
                        flex: 1, padding: "8px", background: "#0f3460", color: "#fff",
                        border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>View</button>

                    <button onClick={() => onEdit(p)} style={{
                        flex: 1, padding: "8px", background: "#f0f4ff", color: "#0f3460",
                        border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>Edit</button>

                    <button onClick={() => onShare(p)} title="Share on WhatsApp" style={{
                        padding: "8px 10px", background: "#dcfce7", color: "#15803d",
                        border: "none", borderRadius: 8, fontWeight: 800, fontSize: 16, cursor: "pointer",
                    }}>
                        <WhatsAppIcon size={16} />
                    </button>

                    <button onClick={() => onDelete(p)} style={{
                        padding: "8px 11px", background: "#fff0f0", color: "#dc2626",
                        border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer",
                    }}>🗑</button>
                </div>
            </div>
        </div>
    );
}

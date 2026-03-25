import { useState } from "react";
import { normalizePropertyMedia, splitPropertyMedia } from "../utils/helpers";
import WhatsAppIcon from "./WhatsAppIcon";

export default function PropertyViewModal({
    property: p,
    onClose,
    onEdit,
    onShare,
    onDelete,
}) {
    const media = normalizePropertyMedia(p);
    const { images, pdfs } = splitPropertyMedia(media);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const activeImage = images[activeImageIndex] || images[0];

    const detailRows = [
        { l: "Status", v: p.status },
        { l: "Size", v: p.size || "-" },
        ...(p.type === "Showroom"
            ? [
                { l: "Floor Area", v: p.floorArea || "-" },
                { l: "Road Facing", v: p.facing || "-" },
            ]
            : [
                { l: "Bedrooms", v: p.bedrooms && p.bedrooms !== "-" ? p.bedrooms : "N/A" },
                { l: "Bathrooms", v: p.bathrooms && p.bathrooms !== "-" ? p.bathrooms : "N/A" },
            ]),
        { l: "Contact", v: p.contact || "-" },
        { l: "Added by", v: p.addedBy || "-" },
        { l: "Date", v: p.date || "-" },
    ];

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
            <div style={{
                background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520,
                boxShadow: "0 24px 70px rgba(0,0,0,0.3)", overflow: "hidden",
                maxHeight: "90vh",
                overflowY: "auto",
            }}>
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
                            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 3 }}>Location: {p.area}</div>
                        </div>
                        <button onClick={onClose} style={{
                            background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                            borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 17,
                        }}>x</button>
                    </div>
                    <div style={{ color: "#e94560", fontSize: 26, fontWeight: 900, marginTop: 12 }}>
                        Rs{p.price} <span style={{ fontSize: 15, color: "#94a3b8" }}>{p.priceUnit}</span>
                    </div>
                </div>

                <div style={{ padding: "18px 22px" }}>
                    {activeImage && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ position: "relative" }}>
                                <img
                                    src={activeImage.url}
                                    alt={p.title}
                                    style={{
                                        width: "100%", height: 220, objectFit: "cover",
                                        borderRadius: 14,
                                    }}
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                            style={{
                                                position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)",
                                                border: "none", width: 34, height: 34, borderRadius: "50%",
                                                background: "rgba(15, 23, 42, 0.65)", color: "#fff", cursor: "pointer",
                                            }}
                                        >
                                            {"<"}
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                                            style={{
                                                position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)",
                                                border: "none", width: 34, height: 34, borderRadius: "50%",
                                                background: "rgba(15, 23, 42, 0.65)", color: "#fff", cursor: "pointer",
                                            }}
                                        >
                                            {">"}
                                        </button>
                                    </>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div style={{
                                    display: "flex", gap: 8, overflowX: "auto", marginTop: 10, paddingBottom: 2,
                                }}>
                                    {images.map((item, index) => (
                                        <button
                                            key={item.url}
                                            onClick={() => setActiveImageIndex(index)}
                                            style={{
                                                border: index === activeImageIndex ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
                                                borderRadius: 10,
                                                padding: 0,
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                background: "#fff",
                                            }}
                                        >
                                            <img
                                                src={item.url}
                                                alt={`${p.title} ${index + 1}`}
                                                style={{ width: 70, height: 54, objectFit: "cover", display: "block" }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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

                    <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                            Description
                        </div>
                        <div style={{ color: "#1a1a2e", fontWeight: 600, fontSize: 14, lineHeight: 1.5 }}>
                            {p.notes || "-"}
                        </div>
                        {pdfs.length > 0 && (
                            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {pdfs.map((item, index) => (
                                    <a
                                        key={item.url}
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "8px 12px",
                                            borderRadius: 999,
                                            textDecoration: "none",
                                            background: "#eff6ff",
                                            color: "#1d4ed8",
                                            fontWeight: 700,
                                            fontSize: 13,
                                        }}
                                    >
                                        PDF {index + 1}: {item.name || "Open document"}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

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

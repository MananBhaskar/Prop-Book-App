import { useEffect, useState } from "react";
import { fetchPropertyById } from "../api/propertyApi";
import { normalizePropertyMedia, splitPropertyMedia } from "../utils/helpers";

export default function PublicPropertyPage({ propertyId, onBack }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadProperty() {
            setLoading(true);
            try {
                const result = await fetchPropertyById(propertyId);
                if (active) {
                    setProperty(result);
                }
            } catch (err) {
                console.error("Failed to load shared property:", err);
                if (active) {
                    setProperty(null);
                }
            }
            if (active) {
                setLoading(false);
            }
        }

        loadProperty();
        return () => {
            active = false;
        };
    }, [propertyId]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [propertyId]);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                color: "#334155",
            }}>
                Loading property...
            </div>
        );
    }

    if (!property) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    textAlign: "center",
                    boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
                }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                        Property not found
                    </div>
                    <div style={{ color: "#64748b", marginBottom: 16 }}>
                        This shared listing is unavailable or may have been removed.
                    </div>
                    <button
                        onClick={onBack}
                        style={{
                            border: "none",
                            borderRadius: 12,
                            padding: "12px 16px",
                            cursor: "pointer",
                            background: "#0f3460",
                            color: "#fff",
                            fontWeight: 700,
                        }}
                    >
                        Back to PropBook
                    </button>
                </div>
            </div>
        );
    }

    const media = normalizePropertyMedia(property);
    const { images, pdfs } = splitPropertyMedia(media);
    const activeImage = images[activeImageIndex] || images[0];

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 40%, #ffffff 100%)",
            padding: 24,
            boxSizing: "border-box",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: "#0f172a",
        }}>
            <div style={{ maxWidth: 920, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: 1 }}>
                            SHARED VIA PROPBOOK
                        </div>
                        <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6 }}>{property.title}</div>
                        <div style={{ color: "#64748b", marginTop: 6 }}>{property.area}</div>
                    </div>
                    <button
                        onClick={onBack}
                        style={{
                            alignSelf: "flex-start",
                            border: "none",
                            borderRadius: 12,
                            padding: "12px 16px",
                            cursor: "pointer",
                            background: "#0f3460",
                            color: "#fff",
                            fontWeight: 700,
                        }}
                    >
                        Open App
                    </button>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.9fr)",
                    gap: 20,
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 18,
                        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
                    }}>
                        {activeImage ? (
                            <>
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={activeImage.url}
                                        alt={property.title}
                                        style={{
                                            width: "100%",
                                            height: 420,
                                            objectFit: "cover",
                                            borderRadius: 18,
                                            display: "block",
                                        }}
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                                style={{
                                                    position: "absolute",
                                                    left: 14,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    border: "none",
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: "50%",
                                                    background: "rgba(15,23,42,0.72)",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {"<"}
                                            </button>
                                            <button
                                                onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                                                style={{
                                                    position: "absolute",
                                                    right: 14,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    border: "none",
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: "50%",
                                                    background: "rgba(15,23,42,0.72)",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {">"}
                                            </button>
                                        </>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div style={{ display: "flex", gap: 10, overflowX: "auto", marginTop: 12, paddingBottom: 2 }}>
                                        {images.map((item, index) => (
                                            <button
                                                key={item.url}
                                                onClick={() => setActiveImageIndex(index)}
                                                style={{
                                                    padding: 0,
                                                    borderRadius: 12,
                                                    overflow: "hidden",
                                                    border: index === activeImageIndex ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={`${property.title} ${index + 1}`}
                                                    style={{ width: 92, height: 70, objectFit: "cover", display: "block" }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                height: 320,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 18,
                                background: "#e2e8f0",
                                color: "#475569",
                                fontWeight: 700,
                            }}>
                                No property image available
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 20,
                        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
                    }}>
                        <div style={{ fontSize: 30, fontWeight: 900, color: "#0f3460" }}>
                            Rs{property.price} <span style={{ fontSize: 16, color: "#64748b" }}>{property.priceUnit}</span>
                        </div>
                        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                            <InfoRow label="Type" value={property.type} />
                            <InfoRow label="Status" value={property.status} />
                            <InfoRow label="Size" value={property.size || "-"} />
                            {property.type === "Showroom" ? (
                                <>
                                    <InfoRow label="Floor Area" value={property.floorArea || "-"} />
                                    <InfoRow label="Facing" value={property.facing || "-"} />
                                </>
                            ) : (
                                <>
                                    <InfoRow label="Bedrooms" value={property.bedrooms || "-"} />
                                    <InfoRow label="Bathrooms" value={property.bathrooms || "-"} />
                                </>
                            )}
                            <InfoRow label="Contact" value={property.contact || "-"} />
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", marginBottom: 8 }}>
                                DESCRIPTION
                            </div>
                            <div style={{ color: "#1e293b", lineHeight: 1.6 }}>
                                {property.notes || "No description added."}
                            </div>
                        </div>

                        {pdfs.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", marginBottom: 8 }}>
                                    DOCUMENTS
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {pdfs.map((item, index) => (
                                        <a
                                            key={item.url}
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: 999,
                                                background: "#eff6ff",
                                                color: "#1d4ed8",
                                                textDecoration: "none",
                                                fontWeight: 700,
                                                fontSize: 13,
                                            }}
                                        >
                                            PDF {index + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            paddingBottom: 10,
            borderBottom: "1px solid #e2e8f0",
        }}>
            <div style={{ color: "#64748b", fontWeight: 700 }}>{label}</div>
            <div style={{ color: "#0f172a", fontWeight: 800, textAlign: "right" }}>{value}</div>
        </div>
    );
}

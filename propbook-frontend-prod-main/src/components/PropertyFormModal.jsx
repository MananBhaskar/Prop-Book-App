import { PROPERTY_TYPES, PRICE_UNITS, STATUS_LIST } from "../utils/constants";

// ─── Shared field styles ───────────────────────────────────────────────────────
const fieldInputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 9,
    border: "1.5px solid #d1d5db", fontSize: 14,
    background: "#ffffff", color: "#1e293b",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
};

const fieldSelectStyle = {
    ...fieldInputStyle,
    cursor: "pointer",
    appearance: "auto",
};

/**
 * Add / Edit property modal with dynamic fields based on property type.
 */
export default function PropertyFormModal({
    form,
    editId,
    uploadingImage,
    onFormChange,
    onImageUpload,
    onClearImage,
    onSave,
    onClose,
}) {
    const isShowroom = form.type === "Showroom";

    const fields = [
        { l: "Property Type", k: "type", t: "select", opts: PROPERTY_TYPES },
        {
            l: "Title *", k: "title", t: "text",
            ph: isShowroom
                ? "e.g. Ground Floor Showroom MG Road"
                : "e.g. 3BHK Kothi Sector 21",
        },
        { l: "Area / Location *", k: "area", t: "text", ph: "e.g. Sector 21, Chandigarh" },
        { l: "Price *", k: "price", t: "number", ph: "e.g. 85" },
        { l: "Price Unit", k: "priceUnit", t: "select", opts: PRICE_UNITS },
        {
            l: isShowroom ? "Plot / Site Size" : "Size", k: "size", t: "text",
            ph: isShowroom ? "e.g. 200 Sq Yd" : "e.g. 150 Sq Yd / 950 Sq Ft",
        },
        ...(isShowroom
            ? [
                { l: "Carpet / Floor Area", k: "floorArea", t: "text", ph: "e.g. 1200 Sq Ft" },
                { l: "Road Facing", k: "facing", t: "text", ph: "e.g. Main Road, East Facing" },
            ]
            : [
                { l: "Bedrooms", k: "bedrooms", t: "text", ph: "e.g. 3 (leave blank for plot)" },
                { l: "Bathrooms", k: "bathrooms", t: "text", ph: "e.g. 2" },
            ]),
        { l: "Status", k: "status", t: "select", opts: STATUS_LIST },
        { l: "Contact Number", k: "contact", t: "text", ph: "Owner/Agent number" },
        {
            l: "Notes", k: "notes", t: "text",
            ph: isShowroom
                ? "e.g. Corner unit, High footfall area"
                : "e.g. Corner plot, Park facing",
        },
    ];

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            backdropFilter: "blur(4px)",
        }}>
            <div style={{
                background: "#fff", borderRadius: 18, width: "100%", maxWidth: 500,
                maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
            }}>
                {/* Modal header */}
                <div style={{
                    background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "18px 22px",
                    borderRadius: "18px 18px 0 0", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>
                        {editId ? "✏️ Edit Property" : "➕ Add New Property"}
                    </span>
                    <button onClick={onClose} style={{
                        background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                        borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 17,
                    }}>✕</button>
                </div>

                {/* Modal body */}
                <div style={{ padding: "20px 22px" }}>
                    {/* Showroom banner */}
                    {isShowroom && (
                        <div style={{
                            background: "#faf5ff", border: "1.5px solid #d8b4fe",
                            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <span style={{ fontSize: 20 }}>🏪</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>
                                Commercial Showroom — filling relevant fields
                            </span>
                        </div>
                    )}

                    {/* Dynamic fields */}
                    {fields.map((f) => (
                        <div key={f.k} style={{ marginBottom: 14 }}>
                            <label style={{
                                fontSize: 13, fontWeight: 600, color: "#374151",
                                display: "block", marginBottom: 5,
                            }}>
                                {f.l}
                            </label>
                            {f.t === "select" ? (
                                <select
                                    value={form[f.k] || ""}
                                    onChange={(e) => onFormChange(f.k, e.target.value)}
                                    style={fieldSelectStyle}
                                >
                                    {f.opts.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={f.t}
                                    value={form[f.k] || ""}
                                    placeholder={f.ph}
                                    onChange={(e) => onFormChange(f.k, e.target.value)}
                                    style={fieldInputStyle}
                                />
                            )}
                        </div>
                    ))}

                    <div style={{ marginBottom: 14 }}>
                        <label style={{
                            fontSize: 13, fontWeight: 600, color: "#374151",
                            display: "block", marginBottom: 5,
                        }}>
                            Property Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onImageUpload(e.target.files?.[0])}
                            style={fieldInputStyle}
                        />
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                            Uploads to Cloudinary instead of Firebase Storage.
                        </div>
                        {uploadingImage && (
                            <div style={{ fontSize: 12, color: "#0f3460", marginTop: 6 }}>
                                Uploading image...
                            </div>
                        )}
                        {form.imageUrl && (
                            <div style={{ marginTop: 10 }}>
                                <img
                                    src={form.imageUrl}
                                    alt="Property preview"
                                    style={{
                                        width: "100%", height: 180, objectFit: "cover",
                                        borderRadius: 12, border: "1px solid #e5e7eb",
                                    }}
                                />
                                <button
                                    onClick={onClearImage}
                                    style={{
                                        marginTop: 8, background: "#fff0f0", color: "#dc2626",
                                        border: "none", borderRadius: 8, padding: "8px 12px",
                                        fontWeight: 700, cursor: "pointer",
                                    }}
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button onClick={onSave} disabled={uploadingImage} style={{
                            flex: 1, padding: "12px",
                            background: "linear-gradient(135deg, #0f3460, #1e88e5)",
                            color: "#fff", border: "none", borderRadius: 10,
                            fontWeight: 800, fontSize: 15, cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(15,52,96,0.3)",
                            opacity: uploadingImage ? 0.7 : 1,
                        }}>
                            {uploadingImage ? "Uploading..." : editId ? "Update Property" : "Save Property"}
                        </button>
                        <button onClick={onClose} style={{
                            padding: "12px 18px", background: "#f1f5f9", color: "#374151",
                            border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15,
                            cursor: "pointer",
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

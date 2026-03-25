/**
 * Search bar + type/status filter dropdowns with improved styling.
 */

const inputStyle = {
    width: "100%", padding: "9px 10px 9px 34px", borderRadius: 9,
    border: "1.5px solid #d1d5db", fontSize: 14, color: "#1e293b",
    background: "#ffffff", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
};

const selectStyle = {
    padding: "9px 14px", borderRadius: 9, border: "1.5px solid #d1d5db",
    fontSize: 14, cursor: "pointer", outline: "none",
    color: "#1e293b", background: "#ffffff",
};

export default function SearchFilter({
    search, onSearchChange,
    fType, onTypeChange,
    fStatus, onStatusChange,
    filteredCount,
}) {
    return (
        <div style={{
            background: "#fff", borderRadius: 14, padding: "14px 18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: 10,
            flexWrap: "wrap", alignItems: "center", marginBottom: 20,
            border: "1px solid #e8ecf1",
        }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <span style={{
                    position: "absolute", left: 11, top: "50%",
                    transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16,
                }}>🔍</span>
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search title, area, contact, notes…"
                    style={inputStyle}
                />
            </div>

            <select value={fType} onChange={(e) => onTypeChange(e.target.value)} style={selectStyle}>
                <option>All</option>
                <option>Kothi</option>
                <option>Flat</option>
                <option>Plot</option>
                <option>Showroom</option>
            </select>

            <select value={fStatus} onChange={(e) => onStatusChange(e.target.value)} style={selectStyle}>
                <option>All</option>
                <option>Available</option>
                <option>Sold</option>
                <option>On Hold</option>
            </select>

            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                {filteredCount} results
            </span>
        </div>
    );
}

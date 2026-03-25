/**
 * Top header bar with branding, user info, action buttons, stats, and tabs.
 * Improved color scheme with deeper gradients and better contrast.
 */
export default function Header({
    user,
    propertiesCount,
    saving,
    stats,
    tab,
    onTabChange,
    onRefresh,
    onAddProperty,
    onLogout,
}) {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        }}>
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "18px 20px 0" }}>
                {/* Top row: branding + actions */}
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 28 }}>🏘️</span>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>PropBook</span>
                                <span style={{
                                    background: "linear-gradient(135deg, #e94560, #c62a40)",
                                    color: "#fff", fontSize: 10,
                                    fontWeight: 800, borderRadius: 5, padding: "2px 8px",
                                    boxShadow: "0 2px 8px rgba(233,69,96,0.3)",
                                }}>LIVE</span>
                                {saving && (
                                    <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 600 }}>
                                        ⟳ Saving…
                                    </span>
                                )}
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: 12 }}>
                                Logged in as <b style={{ color: "#60a5fa" }}>{user}</b> · {propertiesCount} properties
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <button onClick={onRefresh} title="Refresh" style={{
                            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                            color: "#fff", borderRadius: 9, padding: "9px 14px",
                            cursor: "pointer", fontSize: 16,
                            transition: "background 0.2s",
                        }}>⟳</button>

                        <button onClick={onAddProperty} style={{
                            background: "linear-gradient(135deg, #e94560, #c62a40)",
                            color: "#fff", border: "none", borderRadius: 10,
                            padding: "10px 20px", fontWeight: 800, fontSize: 14, cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(233,69,96,0.4)",
                            display: "flex", alignItems: "center", gap: 6,
                            transition: "transform 0.15s, box-shadow 0.15s",
                        }}>
                            <span style={{ fontSize: 18 }}>+</span> Add Property
                        </button>

                        <button onClick={onLogout} style={{
                            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                            color: "#94a3b8", borderRadius: 9, padding: "9px 14px",
                            cursor: "pointer", fontSize: 13,
                            transition: "background 0.2s",
                        }}>Logout</button>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{
                    display: "flex", marginTop: 18,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                }}>
                    {[
                        { l: "Total", v: stats.total, c: "#f1f5f9" },
                        { l: "Available", v: stats.available, c: "#4ade80" },
                        { l: "Sold", v: stats.sold, c: "#f87171" },
                        { l: "On Hold", v: stats.onHold, c: "#fbbf24" },
                    ].map((s) => (
                        <div key={s.l} style={{
                            flex: 1, textAlign: "center", padding: "10px 4px",
                            borderRight: "1px solid rgba(255,255,255,0.06)",
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
                            <div style={{
                                fontSize: 10, color: "#64748b", fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: 0.8,
                            }}>{s.l}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, marginTop: 12, paddingBottom: 0 }}>
                    {["inventory", "activity"].map((t) => (
                        <button key={t} onClick={() => onTabChange(t)} style={{
                            padding: "9px 20px", border: "none", cursor: "pointer",
                            fontWeight: 700, fontSize: 13, borderRadius: "10px 10px 0 0",
                            textTransform: "capitalize",
                            background: tab === t ? "#f0f4f8" : "transparent",
                            color: tab === t ? "#0f172a" : "#64748b",
                            transition: "all 0.2s",
                        }}>
                            {t === "inventory" ? "🏠 Inventory" : "📋 Activity Log"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

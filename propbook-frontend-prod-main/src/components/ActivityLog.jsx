/**
 * Activity log feed — list of timestamped actions with user attribution.
 */
export default function ActivityLog({ activity }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden",
        }}>
            <div style={{
                padding: "16px 20px", borderBottom: "1px solid #f1f5f9",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0f3460" }}>
                    📋 Activity Log
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                    Last {activity.length} actions by all members
                </div>
            </div>

            {activity.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                    No activity yet
                </div>
            ) : (
                activity.map((a) => (
                    <div key={a.id} style={{
                        padding: "13px 20px", borderBottom: "1px solid #f8fafc",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 12,
                    }}>
                        <div>
                            <span style={{ fontWeight: 700, color: "#0f3460", fontSize: 14 }}>
                                {a.msg}
                            </span>
                        </div>
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>
                                {a.user}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.time}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/**
 * Full-page loading indicator.
 */
export default function LoadingScreen() {
    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            justifyContent: "center", background: "#F7F8FA",
            fontFamily: "'Segoe UI',sans-serif", flexDirection: "column", gap: 16,
        }}>
            <div style={{ fontSize: 40 }}>🔄</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f3460" }}>
                Loading shared inventory…
            </div>
        </div>
    );
}

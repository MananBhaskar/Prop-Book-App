/**
 * Toast notification component — fixed position top-right.
 */
export default function Toast({ toast }) {
    if (!toast) return null;

    const isError = toast.type === "error";

    return (
        <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 999,
            background: isError ? "#FEE2E2" : "#DCFCE7",
            color: isError ? "#DC2626" : "#15803D",
            border: `1.5px solid ${isError ? "#FCA5A5" : "#86EFAC"}`,
            padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", animation: "fadeIn 0.2s",
        }}>
            {toast.msg}
        </div>
    );
}

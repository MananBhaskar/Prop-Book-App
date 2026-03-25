import { useState, useEffect } from "react";
import useProperties from "../hooks/useProperties";
import { buildWhatsAppUrl } from "../utils/helpers";
import { logoutUser, onAuthChange } from "../api/auth";
import Toast from "../components/Toast";
import LoginScreen from "../components/LoginScreen";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import PropertyCard from "../components/PropertyCard";
import ActivityLog from "../components/ActivityLog";
import PropertyFormModal from "../components/PropertyFormModal";
import PropertyViewModal from "../components/PropertyViewModal";

/**
 * PropBook Page — thin composition layer.
 * All business logic lives in useProperties hook; UI in component files.
 */
export default function PropBookPage() {
    const [user, setUser] = useState("");
    const [authChecked, setAuthChecked] = useState(false);
    const [tab, setTab] = useState("inventory");

    // ── Listen for Firebase Auth state (persisted sessions) ─────────────
    useEffect(() => {
        const unsub = onAuthChange((firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser.displayName || firebaseUser.email);
            } else {
                setUser("");
            }
            setAuthChecked(true);
        });
        return unsub;
    }, []);

    const {
        properties, activity, loading, saving, uploadingImage, toast,
        filtered, stats,
        search, setSearch, fType, setFType, fStatus, setFStatus,
        form, setForm, editId, showForm, viewProp, setViewProp,
        loadData, handleSave, handleDelete, handleStatusChange,
        handleImageUpload, clearImage,
        openEdit, openAddForm, closeForm, logActivity,
    } = useProperties(user);

    // ── WhatsApp share handler ──────────────────────────────────────────────
    const shareOnWhatsApp = (p) => {
        const url = buildWhatsAppUrl(p);
        window.open(url, "_blank");
        logActivity(`📤 Shared "${p.title}" on WhatsApp`);
    };

    // ── Form field change handler ───────────────────────────────────────────
    const handleFormChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // ── Logout ──────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await logoutUser();
        setUser("");
    };

    // ── Conditional screens ─────────────────────────────────────────────────
    if (!authChecked) return <LoadingScreen />;
    if (!user) return <LoginScreen onLogin={setUser} />;
    if (loading) return <LoadingScreen />;

    // ── Main layout ─────────────────────────────────────────────────────────
    return (
        <div style={{
            minHeight: "100vh", background: "#f0f4f8",
            fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b",
        }}>
            <Toast toast={toast} />

            <Header
                user={user}
                propertiesCount={properties.length}
                saving={saving}
                stats={stats}
                tab={tab}
                onTabChange={setTab}
                onRefresh={loadData}
                onAddProperty={openAddForm}
                onLogout={handleLogout}
            />

            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 16px" }}>
                {/* Inventory tab */}
                {tab === "inventory" && (
                    <>
                        <SearchFilter
                            search={search} onSearchChange={setSearch}
                            fType={fType} onTypeChange={setFType}
                            fStatus={fStatus} onStatusChange={setFStatus}
                            filteredCount={filtered.length}
                        />

                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                                <div style={{ fontSize: 46 }}>🏗️</div>
                                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>
                                    No properties found
                                </div>
                                <div style={{ fontSize: 14, marginTop: 6 }}>
                                    Add a property or try a different search
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                                gap: 16,
                            }}>
                                {filtered.map((p) => (
                                    <PropertyCard
                                        key={p.id}
                                        property={p}
                                        onView={setViewProp}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                        onStatusChange={handleStatusChange}
                                        onShare={shareOnWhatsApp}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Activity tab */}
                {tab === "activity" && <ActivityLog activity={activity} />}
            </div>

            {/* Modals */}
            {showForm && (
                <PropertyFormModal
                    form={form}
                    editId={editId}
                    uploadingImage={uploadingImage}
                    onFormChange={handleFormChange}
                    onImageUpload={handleImageUpload}
                    onClearImage={clearImage}
                    onSave={handleSave}
                    onClose={closeForm}
                />
            )}

            {viewProp && (
                <PropertyViewModal
                    property={viewProp}
                    onClose={() => setViewProp(null)}
                    onEdit={openEdit}
                    onShare={shareOnWhatsApp}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

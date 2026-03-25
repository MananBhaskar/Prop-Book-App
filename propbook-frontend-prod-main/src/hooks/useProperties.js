import { useState, useMemo, useEffect, useCallback } from "react";
import { BLANK_FORM, MAX_MEDIA_FILES } from "../utils/constants";
import { now, normalizePropertyMedia } from "../utils/helpers";
import { uploadImageToCloudinary } from "../api/cloudinary";
import {
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty as apiDeleteProperty,
    fetchActivity,
    postActivity,
} from "../api/propertyApi";

/**
 * Custom hook encapsulating all PropBook business logic.
 * Uses Firebase Firestore via the propertyApi module.
 *
 * @param {string} user - Currently logged-in user name
 * @returns {Object} All state and action handlers needed by the UI
 */
export default function useProperties(user) {
    const normalizeProperty = useCallback((property) => {
        const mediaFiles = normalizePropertyMedia(property);
        return {
            ...property,
            mediaFiles,
            imageUrl: mediaFiles.find((item) => item.kind === "image")?.url || "",
        };
    }, []);

    const [properties, setProperties] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [toast, setToast] = useState(null);

    const [search, setSearch] = useState("");
    const [fType, setFType] = useState("All");
    const [fStatus, setFStatus] = useState("All");

    const [form, setForm] = useState(BLANK_FORM);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewProp, setViewProp] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [props, acts] = await Promise.all([
                fetchProperties(),
                fetchActivity(),
            ]);
            setProperties(Array.isArray(props) ? props.map(normalizeProperty) : []);
            setActivity(Array.isArray(acts) ? acts : []);
        } catch (err) {
            console.error("Failed to load data:", err);
            setProperties([]);
            setActivity([]);
        }
        setLoading(false);
    }, [normalizeProperty]);

    useEffect(() => {
        if (user) loadData();
    }, [loadData, user]);

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const logActivity = useCallback(async (msg) => {
        const entry = { user, msg, time: now() };
        try {
            const saved = await postActivity(entry);
            setActivity((prev) => [saved, ...prev]);
        } catch (err) {
            console.error("Failed to log activity:", err);
            setActivity((prev) => [{ ...entry, id: Date.now().toString() }, ...prev]);
        }
    }, [user]);

    const handleSave = useCallback(async () => {
        if (!form.title || !form.area || !form.price) {
            showToast("Please fill Title, Area and Price", "error");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                imageUrl: form.mediaFiles.find((item) => item.kind === "image")?.url || "",
            };

            if (editId) {
                const updated = normalizeProperty(await updateProperty(editId, {
                    ...payload,
                    id: editId,
                }));
                setProperties((prev) =>
                    prev.map((p) => (p.id === editId ? updated : p))
                );
                logActivity(`Updated "${form.title}" (${form.area})`);
                showToast("Property updated!");
            } else {
                const created = normalizeProperty(await createProperty({
                    ...payload,
                    addedBy: user,
                    date: now(),
                }));
                setProperties((prev) => [created, ...prev]);
                logActivity(`Added "${form.title}" - Rs${form.price} ${form.priceUnit} (${form.area})`);
                showToast("Property added!");
            }

            setShowForm(false);
            setEditId(null);
            setForm(BLANK_FORM);
        } catch (err) {
            console.error("Save failed:", err);
            const msg = err.message || "Unknown error";
            showToast(`Save failed: ${msg}`, "error");
        }
        setSaving(false);
    }, [form, editId, user, logActivity, normalizeProperty, showToast]);

    const handleDelete = useCallback(async (p) => {
        if (!window.confirm(`Delete "${p.title}"?`)) return;
        setSaving(true);
        try {
            await apiDeleteProperty(p.id);
            setProperties((prev) => prev.filter((x) => x.id !== p.id));
            logActivity(`Deleted "${p.title}" (${p.area})`);
            setViewProp(null);
            showToast("Property deleted.");
        } catch (err) {
            console.error("Delete failed:", err);
            showToast(`Delete failed: ${err.message}`, "error");
        }
        setSaving(false);
    }, [logActivity, showToast]);

    const handleStatusChange = useCallback(async (p, status) => {
        setSaving(true);
        try {
            const updated = normalizeProperty(await updateProperty(p.id, { ...p, status }));
            setProperties((prev) =>
                prev.map((x) => (x.id === p.id ? updated : x))
            );
            logActivity(`Changed "${p.title}" status to ${status}`);
            if (viewProp?.id === p.id) setViewProp(updated);
            showToast(`Status -> ${status}`);
        } catch (err) {
            console.error("Status change failed:", err);
            showToast(`Status change failed: ${err.message}`, "error");
        }
        setSaving(false);
    }, [viewProp, logActivity, normalizeProperty, showToast]);

    const handleImageUpload = useCallback(async (files) => {
        const selectedFiles = Array.isArray(files)
            ? files
            : files instanceof FileList
                ? Array.from(files)
                : files
                    ? [files]
                    : [];

        if (!selectedFiles.length) return;

        if (form.mediaFiles.length + selectedFiles.length > MAX_MEDIA_FILES) {
            showToast(`You can upload up to ${MAX_MEDIA_FILES} files per property.`, "error");
            return;
        }

        setUploadingImage(true);
        try {
            const uploadedFiles = await Promise.all(
                selectedFiles.map((file) => uploadImageToCloudinary(file))
            );
            setForm((prev) => {
                const mediaFiles = [...prev.mediaFiles, ...uploadedFiles];
                return {
                    ...prev,
                    mediaFiles,
                    imageUrl: mediaFiles.find((item) => item.kind === "image")?.url || "",
                };
            });
            showToast(`${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} uploaded.`);
        } catch (err) {
            console.error("Upload failed:", err);
            showToast(`Upload failed: ${err.message}`, "error");
        }
        setUploadingImage(false);
    }, [form.mediaFiles.length, showToast]);

    const clearImage = useCallback((index) => {
        setForm((prev) => {
            const mediaFiles = typeof index === "number"
                ? prev.mediaFiles.filter((_, itemIndex) => itemIndex !== index)
                : [];

            return {
                ...prev,
                mediaFiles,
                imageUrl: mediaFiles.find((item) => item.kind === "image")?.url || "",
            };
        });
    }, []);

    const openEdit = useCallback((p) => {
        const mediaFiles = normalizePropertyMedia(p);
        setForm({
            type: p.type || "Flat",
            title: p.title || "",
            area: p.area || "",
            price: p.price || "",
            priceUnit: p.priceUnit || "Lakh",
            size: p.size || "",
            bedrooms: p.bedrooms || "",
            bathrooms: p.bathrooms || "",
            floorArea: p.floorArea || "",
            facing: p.facing || "",
            status: p.status || "Available",
            contact: p.contact || "",
            notes: p.notes || "",
            imageUrl: mediaFiles.find((item) => item.kind === "image")?.url || "",
            mediaFiles,
        });
        setEditId(p.id);
        setShowForm(true);
        setViewProp(null);
    }, []);

    const openAddForm = useCallback(() => {
        setShowForm(true);
        setEditId(null);
        setForm(BLANK_FORM);
    }, []);

    const closeForm = useCallback(() => {
        setShowForm(false);
        setEditId(null);
    }, []);

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            const q = search.toLowerCase();
            const searchable = [p.title, p.area, p.type, p.contact, p.notes]
                .filter(Boolean).join(" ").toLowerCase();
            const matchesSearch = !q || searchable.includes(q);
            const matchesType = fType === "All" || p.type === fType;
            const matchesStatus = fStatus === "All" || p.status === fStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [properties, search, fType, fStatus]);

    const stats = useMemo(() => ({
        total: properties.length,
        available: properties.filter((p) => p.status === "Available").length,
        sold: properties.filter((p) => p.status === "Sold").length,
        onHold: properties.filter((p) => p.status === "On Hold").length,
    }), [properties]);

    return {
        properties, activity, loading, saving, uploadingImage, toast,
        filtered, stats,
        search, setSearch, fType, setFType, fStatus, setFStatus,
        form, setForm, editId, showForm, viewProp, setViewProp,
        loadData, handleSave, handleDelete, handleStatusChange,
        handleImageUpload, clearImage,
        openEdit, openAddForm, closeForm, logActivity, showToast,
    };
}

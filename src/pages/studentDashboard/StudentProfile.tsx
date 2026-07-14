import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit, FiSave, FiUpload, FiX } from "react-icons/fi";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useUpdateUserProfile } from "../../hooks/mutations/auth";
import { useGetUserProfile } from "../../hooks/queries/allQueries";

const StudentProfile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { userProfile, isLoading } = useGetUserProfile();
    const user = userProfile?.data;

    const { mutate, isPending } = useUpdateUserProfile();

    // ── Text fields (sent as plain strings) ─────────────────────────────────
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
    });

    // ── Image: keep the actual File separate from the preview URL ──────────
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>("");

    // Sync form data whenever fetched profile changes
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
            });
            setProfileImagePreview(user.profile_image || "");
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("Image size should be less than 5MB");
                return;
            }
            setProfileImageFile(file);
            // preview only, not what gets sent
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = () => {
        setErrorMessage("");

        // ── Build multipart FormData, not JSON ──────────────────────────────
        const payload = new FormData();
        payload.append("first_name", formData.first_name);
        payload.append("last_name", formData.last_name);
        if (profileImageFile instanceof File) {
            payload.append("profile_image", profileImageFile, profileImageFile.name);
        }

        mutate(payload, {
            onSuccess: () => {
                setIsEditing(false);
                setProfileImageFile(null);
                setSuccessMessage("Profile updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            },
            onError: (e: any) => {
                setErrorMessage(
                    e.response?.data?.message ||
                    e.response?.data?.detail ||
                    e.response?.data?.profile_image?.[0] ||
                    "Failed to update profile."
                );
            },
        });
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
            });
            setProfileImagePreview(user.profile_image || "");
        }
        setProfileImageFile(null);
        setErrorMessage("");
        setIsEditing(false);
    };

    const getInitials = () => {
        const f = formData.first_name?.[0] || "";
        const l = formData.last_name?.[0] || "";
        return `${f}${l}`.toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="md:pl-56 pb-20 md:pb-8 flex items-center justify-center min-h-screen">
                <LoadingOverlay visible={isLoading} />
            </div>
        );
    }

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <LoadingOverlay visible={isPending} />
            <div className="min-h-screen pt-14 bg-linear-to-br from-green-50 via-white to-teal-50">
                <div className="px-4 sm:px-6 lg:px-8 pt-8 max-w-4xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                            My Profile
                        </h1>
                        <p className="text-gray-600 text-sm">Manage your account information</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                <FiCheck className="text-white" size={14} />
                            </div>
                            <p className="text-sm font-semibold text-green-700">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    {/* Profile Header Card (no buttons here anymore) */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl bg-green-950 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-gray-100 overflow-hidden">
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Profile"
                                            className="w-full h-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        getInitials()
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-all shadow-lg"
                                    >
                                        <FiUpload size={16} />
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Quick Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {user?.full_name || `${formData.first_name} ${formData.last_name}`}
                                </h2>
                                <p className="text-gray-600 text-sm mb-1">{user?.email}</p>
                                <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={isPending}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-60"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600">{formData.first_name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={isPending}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:opacity-60"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600">{formData.last_name}</p>
                                )}
                            </div>

                            {/* Email - read only */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>

                            {/* Role - read only */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">
                                    Role
                                </label>
                                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Buttons moved here, below the form ── */}
                    <div className="flex justify-end gap-3">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 transition-all"
                            >
                                <FiEdit size={14} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
                                >
                                    <FiX size={14} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 disabled:opacity-50 transition-all"
                                >
                                    <FiSave size={14} />
                                    {isPending ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
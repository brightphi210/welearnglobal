import { useRef, useState } from "react";
import { FiCheck, FiEdit, FiSave, FiUpload, FiX } from "react-icons/fi";

interface StudentProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    profileImage: string | null;
    joinDate: string;
    timezone: string;
    preferredLearningStyle: string;
}

const StudentProfile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<StudentProfileData>({
        id: "STU001",
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex.johnson@email.com",
        phone: "+1 (555) 123-4567",
        bio: "Passionate learner focused on mathematics and physics. Preparing for university entrance exams.",
        profileImage: null,
        joinDate: "January 15, 2024",
        timezone: "GMT-5 (Eastern Time)",
        preferredLearningStyle: "Structured lessons with practice problems",
    });

    const [formData, setFormData] = useState(profileData);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
                setFormData((prev) => ({
                    ...prev,
                    profileImage: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProfileData(formData);
        setIsEditing(false);
        setIsSaving(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleCancel = () => {
        setFormData(profileData);
        setProfileImage(null);
        setIsEditing(false);
    };

    const getInitials = () => {
        return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen pt-14 bg-linear-to-br from-green-50 via-white to-teal-50">
                <div className="px-4 sm:px-6 lg:px-8 pt-8 max-w-4xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                            My Profile
                        </h1>
                        <p className="text-gray-600 text-sm">Manage your account information and preferences</p>
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

                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl bg-green-950 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-gray-100">
                                    {profileImage || profileData.profileImage ? (
                                        <img
                                            src={profileImage || profileData.profileImage || ""}
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
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Quick Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {profileData.firstName} {profileData.lastName}
                                </h2>
                                <p className="text-gray-600 text-sm mb-3">Student ID: {profileData.id}</p>
                                <p className="text-gray-600 text-xs mb-3">Member since {profileData.joinDate}</p>

                                {/* Edit Button */}
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 transition-all"
                                    >
                                        <FiEdit size={14} />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveChanges}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 disabled:opacity-50 transition-all"
                                        >
                                            <FiSave size={14} />
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all"
                                        >
                                            <FiX size={14} />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>

                            <div className="space-y-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                                        First Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{profileData.firstName}</p>
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
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{profileData.lastName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{profileData.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{profileData.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Learning Preferences */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Preferences</h3>

                            <div className="space-y-4">
                                {/* Timezone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                                        Timezone
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        >
                                            <option>GMT-5 (Eastern Time)</option>
                                            <option>GMT-6 (Central Time)</option>
                                            <option>GMT-7 (Mountain Time)</option>
                                            <option>GMT-8 (Pacific Time)</option>
                                            <option>GMT (London)</option>
                                            <option>GMT+1 (Paris)</option>
                                            <option>GMT+5:30 (India)</option>
                                            <option>GMT+8 (Singapore)</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm text-gray-600">{profileData.timezone}</p>
                                    )}
                                </div>

                                {/* Learning Style */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                                        Preferred Learning Style
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="preferredLearningStyle"
                                            value={formData.preferredLearningStyle}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        >
                                            <option>Structured lessons with practice problems</option>
                                            <option>One-on-one discussions</option>
                                            <option>Interactive problem-solving</option>
                                            <option>Theory-focused approach</option>
                                            <option>Mix of theory and practice</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            {profileData.preferredLearningStyle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">About You</h3>

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                                placeholder="Tell tutors about your learning goals and background..."
                            />
                        ) : (
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {profileData.bio}
                            </p>
                        )}
                    </div>

                    {/* Account Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-green-700">📚</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Active Subscriptions</p>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-green-700">✅</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Sessions Completed</p>
                            <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-green-700">⭐</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">4.8</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
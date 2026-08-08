import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";



// ==================== EVERY HERE IS USERS ===========================

// ============== USER PROFILE ===============
export const useGetUserProfile = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("users/me/", token);
        },
    });

    return {
        userProfile: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

// ============== GET ALL Tutors ===============
export const useGetTutors = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("tutors/", token);
        },
    });

    return {
        tutors: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};



// ============== GET Single Tutor ===============
export const useGetSingleTutor = (id: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutors", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests(`tutors/${id}/`, token);
        },
    });

    return {
        tutorData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetMyBookingsAsUser = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["myBookingsAsUser"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("users/bookings/", token);
        },
    });

    return {
        myBookingsAsUser: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};








// ========================== EVERYTHING BELOW IS FOR TUTOR PROFILE ==========================


// ================ TUTOR PROFILE ================
export const useGetTutorProfile = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutorProfile"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("tutors/my-profile/", token);
        },
    });

    return {
        tutorProfile: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


// ================ TUTOR PROFILE ================
export const useGetMyBookingsAsTutor = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["myBookingsAsTutor"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("tutors/my-bookings/", token);
        },
    });

    return {
        myBookingsAsTutor: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};



// ================ TUTOR PROFILE ================
export const useGetTutorStats = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutorStats"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnToken")) || "";
            return get_requests("tutors/my-profile/dashboard-stats", token);
        },
    });

    return {
        tutorStats: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};




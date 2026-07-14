import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";

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
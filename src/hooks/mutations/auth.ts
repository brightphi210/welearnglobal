import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patch_requests, post_requests } from "../helper/AxioHelper";

export const useRegistration = () => {
  const registrationMutation = useMutation({
    mutationFn: (data: any) => post_requests("users/register/", data),
  });

  return registrationMutation;
};


export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: (data: any) => post_requests("auth/login/", data),
  });

  return loginMutation;
};



// ========== UPDATE USER PROFILE ==========+
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  const updateUserProfile = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return patch_requests(`users/me/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })

  return updateUserProfile
}


// ========== CREATE TUTOR PROFILE ==========+
export const useCreateTutorProfile = () => {
  const queryClient = useQueryClient()

  const createTutorProfile = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return post_requests(`tutors/my-profile/create/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })

  return createTutorProfile
}

export const useUpdateTutorProfile = () => {
  const queryClient = useQueryClient()

  const updateTutorProfile = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return patch_requests(`tutors/my-profile/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })

  return updateTutorProfile
}
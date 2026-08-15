import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patch_requests, post_requests } from "../helper/AxioHelper";


// ==================== USERS HOOK ====================

export const useMakeBookings = () => {
  const queryClient = useQueryClient()

  const makeBookings = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return post_requests(`bookings/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  return makeBookings
}


export const useStartUserChat = () => {
  const queryClient = useQueryClient()

  const startUserChat = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return post_requests(`chat/start/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })

  return startUserChat
}






// ===================== TUTORS HOOK ====================

export const useAcceptOrDeclineBooking = (bookingId: string) => {
  const queryClient = useQueryClient()

  const makeBookings = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return patch_requests(`bookings/${bookingId}/respond/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookingsAsTutor"] })
    },
  })

  return makeBookings
}

export const useCompleteBooking = (bookingId: string) => {
  const queryClient = useQueryClient()

  const completeBookings = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return patch_requests(`bookings/${bookingId}/complete/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookingsAsTutor"] })
    },
  })

  return completeBookings
}



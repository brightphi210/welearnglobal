import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post_request_blob, post_requests } from "../helper/AxioHelper";


// ==================== CERTIFICATE HOOKS ====================


export const useGenerateReport = () => {
  const queryClient = useQueryClient()

  const generateReport = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("retirementAccessToken")) || ""
      return post_requests(`fincanceRecord/generateReport`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated"] })
    },
  })

  return generateReport
}



export const useDownloadReport = (randomInts: any) => {
  const queryClient = useQueryClient()

  const downloadReport = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("retirementAccessToken")) || ""
      const response = await post_request_blob(`fincanceRecord/downloadReport/${randomInts}`, data, token)

      // ── Trigger browser download from the blob ──────────────────────
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'WINTRICE_Financial_Report.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downloaded"] })
    },
  })

  return downloadReport
}

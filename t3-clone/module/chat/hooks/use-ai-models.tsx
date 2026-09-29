import { useQuery } from "@tanstack/react-query";

 const useAiModels = () => {
    return useQuery({
        queryKey: ["ai-models"],
        queryFn: () => fetch("/api/ai/get-models").then((res) => res.json()),
    })
}

// export const useAiModelDetails = (modelId: string) => {
//     return useQuery({
//         queryKey: ["ai-model-details", modelId],
//         queryFn: () => fetch(`/api/ai/get-models/${modelId}`).then((res) => res.json()),
//     })
// }
export default useAiModels;
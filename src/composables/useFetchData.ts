import { ref } from "vue";

export function useFetchData() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchData = async (url: string, params: object) => {
    loading.value = true;
    error.value = null;

    try {
      const runtime = useRuntimeConfig();
      const baseUrl = runtime.public.apiBaseUrl;
      const queryString = new URLSearchParams(params as any).toString();
      url=`${baseUrl}/map/get-extent-layer/`;
      const fullUrl = `${url}?${queryString}`;

      const {data} = await useFetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
        },
      });
      if (!data) {
        throw new Error("Failed to fetch GeoJSONnpm  data");
      }
      return await data.value;
    } catch (err) {
      error.value = err as Error;
      console.log("error",err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { fetchData, loading, error };
}

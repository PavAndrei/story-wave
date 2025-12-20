export const buildQueryString = (
  params: Record<string, string | string[] | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      value.forEach((v) => searchParams.append(key, v));
      return;
    }

    if (value.trim() === "") return;

    searchParams.append(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

"use client";

import { useCallback, useEffect, useState } from "react";
import { api, qs, type Paginated } from "@/app/lib/admin-client";

export function usePaginatedList<T>(basePath: string, extraParams: Record<string, string | undefined> = {}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<T>>({
    items: [],
    pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extraKey = JSON.stringify(extraParams);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = JSON.parse(extraKey);
      const result = await api.get<Paginated<T>>(`${basePath}${qs({ page, pageSize: 20, ...params })}`);
      setData(result);
    } catch (err: any) {
      setError(err.message ?? "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, page, extraKey]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    setPage(1);
  }, [extraKey]);

  return { ...data, loading, error, page, setPage, reload };
}

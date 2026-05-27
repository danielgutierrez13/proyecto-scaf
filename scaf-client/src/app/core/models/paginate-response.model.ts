export interface PaginateResponse<T> {
  lista: T[];
  totalItems: number;
  totalPaginas: number;
  numeroPagina: number;
}

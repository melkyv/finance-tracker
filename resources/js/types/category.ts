import { PaginationData } from "./pagination";

export interface Category {
    id: number;
    name: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface CategoryForm {
  name: string;
  description: string;
  user_id: number;
}

export interface CategoryIndexProps {
  categories: PaginationData<Category>;
  filters: {
    search: string,
    page: number,
    perPage: number
  };
}

export interface CategoryViewProps {
  category: Category
}
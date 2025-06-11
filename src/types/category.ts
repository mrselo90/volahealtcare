export interface CategoryData {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  slug: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData extends Omit<CategoryData, 'id' | 'orderIndex' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

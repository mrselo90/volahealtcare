export interface CategoryData {
  id: string;
  name: string; // Stored as JSON string
  description: string; // Stored as JSON string
  slug: string;
  orderIndex: number;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  displayName?: (lang?: string) => string;
  displayDescription?: (lang?: string) => string;
}

export interface CategoryFormData extends Omit<CategoryData, 'id' | 'orderIndex' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
}

export interface CategoryFormProps {
  category: CategoryData | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface CategoryCardProps {
  category: CategoryData;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  loading: boolean;
}

export interface EmptyStateProps {
  onAddCategory: () => void;
}

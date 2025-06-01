
export interface CustomerNote {
  id: string;
  customer_id: string;
  staff_id: string;
  note: string;
  category: string;
  tags: string[];
  is_important: boolean;
  created_at: string;
  updated_at: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

export interface CreateNoteData {
  note: string;
  category: string;
  tags: string[];
  is_important: boolean;
}

export interface UpdateNoteData {
  note?: string;
  category?: string;
  tags?: string[];
  is_important?: boolean;
}

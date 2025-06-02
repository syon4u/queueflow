
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface Category {
  value: string;
  label: string;
}

interface NoteFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  // Ensure selectedCategory is never an empty string and filter out any empty categories
  const currentCategory = (!selectedCategory || selectedCategory === '') ? 'all' : selectedCategory;
  const validCategories = categories.filter(category => category.value && category.value.trim() !== '');

  console.log('NoteFilters - selectedCategory:', selectedCategory);
  console.log('NoteFilters - currentCategory:', currentCategory);
  console.log('NoteFilters - categories:', categories);
  console.log('NoteFilters - validCategories:', validCategories);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Select value={currentCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {validCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {currentCategory !== 'all' && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onCategoryChange('all')}
            >
              {validCategories.find(c => c.value === currentCategory)?.label} ×
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


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
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory !== 'all' && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onCategoryChange('all')}
            >
              {categories.find(c => c.value === selectedCategory)?.label} ×
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormErrors, PropertyFormData, propertyTypes } from '@/types/properties-type';

interface Props {
  formData: PropertyFormData;
  formErrors: FormErrors;
  onInputChange: (field: string, value: any) => void;
  onInputBlur: (field: string) => void;
  onSelectBlur: (field: string) => void;
}

export const BasicInformationSection: React.FC<Props> = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur,
  onSelectBlur
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <div className="space-y-2">
        <Label htmlFor="title">Property Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Modern Apartment in Gulshan"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          onBlur={() => onInputBlur('title')}
        />
        {formErrors.title && <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail..."
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          onBlur={() => onInputBlur('description')}
        />
        {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="listingType">Listing Type *</Label>
          <Select
            value={formData.listingType}
            onValueChange={(value: 'rent' | 'sale') => onInputChange('listingType', value)}
            onOpenChange={(isOpen) => !isOpen && onSelectBlur('listingType')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.listingType && <p className="text-sm text-red-500 mt-1">{formErrors.listingType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value: any) => onInputChange('propertyType', value)}
            onOpenChange={(isOpen) => !isOpen && onSelectBlur('propertyType')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.propertyType && <p className="text-sm text-red-500 mt-1">{formErrors.propertyType}</p>}
        </div>
      </div>
    </div>
  );
};
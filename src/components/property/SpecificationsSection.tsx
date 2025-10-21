/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormErrors, PropertyFormData } from '@/types/properties-type';

interface Props {
  formData: PropertyFormData;
  formErrors: FormErrors;
  onInputChange: (field: string, value: any) => void;
  onInputBlur: (field: string) => void;
}

export const SpecificationsSection: React.FC<Props> = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Property Specifications</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="2"
            value={formData.bedrooms}
            onChange={(e) => onInputChange('bedrooms', parseInt(e.target.value) || 0)}
            onBlur={() => onInputBlur('bedrooms')}
          />
          {formErrors.bedrooms && <p className="text-sm text-red-500 mt-1">{formErrors.bedrooms}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms *</Label>
          <Input
            id="bathrooms"
            type="number"
            step="0.5"
            placeholder="2"
            value={formData.bathrooms}
            onChange={(e) => onInputChange('bathrooms', parseFloat(e.target.value) || 0)}
            onBlur={() => onInputBlur('bathrooms')}
          />
          {formErrors.bathrooms && <p className="text-sm text-red-500 mt-1">{formErrors.bathrooms}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaSize">Area Size *</Label>
          <Input
            id="areaSize"
            type="number"
            placeholder="1200"
            value={formData.areaSize}
            onChange={(e) => onInputChange('areaSize', parseFloat(e.target.value) || 0)}
            onBlur={() => onInputBlur('areaSize')}
          />
          {formErrors.areaSize && <p className="text-sm text-red-500 mt-1">{formErrors.areaSize}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaUnit">Area Unit *</Label>
          <Select
            value={formData.areaUnit}
            onValueChange={(value: any) => onInputChange('areaUnit', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Square Feet</SelectItem>
              <SelectItem value="sqm">Square Meters</SelectItem>
              <SelectItem value="acres">Acres</SelectItem>
              <SelectItem value="hectares">Hectares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor">Floor Number</Label>
          <Input
            id="floor"
            type="number"
            placeholder="5"
            value={formData.floor || ''}
            onChange={(e) => onInputChange('floor', parseInt(e.target.value) || undefined)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFloors">Total Floors</Label>
          <Input
            id="totalFloors"
            type="number"
            placeholder="8"
            value={formData.totalFloors || ''}
            onChange={(e) => onInputChange('totalFloors', parseInt(e.target.value) || undefined)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            placeholder="2020"
            min="1800"
            max={new Date().getFullYear()}
            value={formData.yearBuilt || ''}
            onChange={(e) => onInputChange('yearBuilt', parseInt(e.target.value) || undefined)}
          />
        </div>
      </div>

      {/* Lot Size for Houses/Land */}
      {(formData.propertyType === 'house' || formData.propertyType === 'land' || formData.propertyType === 'villa') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              placeholder="5000"
              value={formData.lotSize || ''}
              onChange={(e) => onInputChange('lotSize', parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lotUnit">Lot Unit</Label>
            <Select
              value={formData.lotUnit || 'sqft'}
              onValueChange={(value: any) => onInputChange('lotUnit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sqft">Square Feet</SelectItem>
                <SelectItem value="sqm">Square Meters</SelectItem>
                <SelectItem value="acres">Acres</SelectItem>
                <SelectItem value="hectares">Hectares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
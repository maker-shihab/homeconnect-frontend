/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bangladeshCities, FormErrors, PropertyFormData, states } from '@/types/properties-type';

interface Props {
  formData: PropertyFormData;
  formErrors: FormErrors;
  onInputChange: (field: string, value: any) => void;
  onInputBlur: (field: string) => void;
  onSelectBlur: (field: string) => void;
}

export const LocationSection: React.FC<Props> = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur,
  onSelectBlur
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Location Details</h3>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address *</Label>
        <Input
          id="address"
          placeholder="House #123, Road #456, Gulshan 1"
          value={formData.address}
          onChange={(e) => onInputChange('address', e.target.value)}
          onBlur={() => onInputBlur('address')}
        />
        {formErrors.address && <p className="text-sm text-red-500 mt-1">{formErrors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => onInputChange('city', value)}
            onOpenChange={(isOpen) => !isOpen && onSelectBlur('city')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {bangladeshCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.city && <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Area/Neighborhood *</Label>
          <Input
            id="neighborhood"
            placeholder="e.g., Gulshan, Banani, Dhanmondi"
            value={formData.neighborhood}
            onChange={(e) => onInputChange('neighborhood', e.target.value)}
            onBlur={() => onInputBlur('neighborhood')}
          />
          {formErrors.neighborhood && <p className="text-sm text-red-500 mt-1">{formErrors.neighborhood}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Division *</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => onInputChange('state', value)}
            onOpenChange={(isOpen) => !isOpen && onSelectBlur('state')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.state && <p className="text-sm text-red-500 mt-1">{formErrors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onInputChange('country', e.target.value)}
            onBlur={() => onInputBlur('country')}
            disabled
          />
          {formErrors.country && <p className="text-sm text-red-500 mt-1">{formErrors.country}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            placeholder="e.g., 1212"
            value={formData.zipCode || ''}
            onChange={(e) => onInputChange('zipCode', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="e.g., 23.8103"
            value={formData.latitude || ''}
            onChange={(e) => onInputChange('latitude', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="e.g., 90.4125"
            value={formData.longitude || ''}
            onChange={(e) => onInputChange('longitude', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};
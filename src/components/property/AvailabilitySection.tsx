/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { amenitiesList, FormErrors, PropertyFormData } from '@/types/properties-type';
interface Props {
  formData: PropertyFormData;
  formErrors: FormErrors;
  onInputChange: (field: string, value: any) => void;
  onInputBlur: (field: string) => void;
}

export const AvailabilitySection: React.FC<Props> = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur
}) => {
  const isRental = formData.listingType === 'rent';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Availability & Additional Details</h3>

      {/* Rental Specific Availability */}
      {isRental && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From *</Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => onInputChange('availableFrom', e.target.value)}
                onBlur={() => onInputBlur('availableFrom')}
              />
              {formErrors.availableFrom && <p className="text-sm text-red-500 mt-1">{formErrors.availableFrom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStay">Minimum Stay (months) *</Label>
              <Input
                id="minimumStay"
                type="number"
                placeholder="6"
                value={formData.minimumStay || 12}
                onChange={(e) => onInputChange('minimumStay', parseInt(e.target.value) || 12)}
                onBlur={() => onInputBlur('minimumStay')}
              />
              {formErrors.minimumStay && <p className="text-sm text-red-500 mt-1">{formErrors.minimumStay}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maximumStay">Maximum Stay (months)</Label>
              <Input
                id="maximumStay"
                type="number"
                placeholder="24"
                value={formData.maximumStay || ''}
                onChange={(e) => onInputChange('maximumStay', parseInt(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaseDuration">Lease Duration (months)</Label>
              <Input
                id="leaseDuration"
                type="number"
                placeholder="12"
                value={formData.leaseDuration || ''}
                onChange={(e) => onInputChange('leaseDuration', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="petPolicy">Pet Policy</Label>
              <Select
                value={formData.petPolicy}
                onValueChange={(value: any) => onInputChange('petPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Pets Allowed</SelectItem>
                  <SelectItem value="not-allowed">No Pets</SelectItem>
                  <SelectItem value="case-by-case">Case by Case</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smokingPolicy">Smoking Policy</Label>
              <Select
                value={formData.smokingPolicy}
                onValueChange={(value: any) => onInputChange('smokingPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Smoking Allowed</SelectItem>
                  <SelectItem value="not-allowed">No Smoking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFurnished"
              checked={formData.isFurnished}
              onChange={(e) => onInputChange('isFurnished', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isFurnished">Furnished</Label>
          </div>
        </div>
      )}

      {/* Sale Specific Details */}
      {!isRental && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyCondition">Property Condition</Label>
              <Select
                value={formData.propertyCondition}
                onValueChange={(value: any) => onInputChange('propertyCondition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                  <SelectItem value="new-construction">New Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownershipType">Ownership Type</Label>
              <Select
                value={formData.ownershipType}
                onValueChange={(value: any) => onInputChange('ownershipType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freehold">Freehold</SelectItem>
                  <SelectItem value="leasehold">Leasehold</SelectItem>
                  <SelectItem value="condominium">Condominium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoaFee">HOA Fee</Label>
              <Input
                id="hoaFee"
                type="number"
                placeholder="5000"
                value={formData.hoaFee || ''}
                onChange={(e) => onInputChange('hoaFee', parseFloat(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoaFrequency">HOA Frequency</Label>
              <Select
                value={formData.hoaFrequency || 'monthly'}
                onValueChange={(value: any) => onInputChange('hoaFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Amenities (Common for both) */}
      <div className="space-y-4">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`amenity-${amenity}`}
                checked={formData.amenities.includes(amenity)}
                onChange={(e) => {
                  const updatedAmenities = e.target.checked
                    ? [...formData.amenities, amenity]
                    : formData.amenities.filter(a => a !== amenity);
                  onInputChange('amenities', updatedAmenities);
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="modern, luxury, spacious, garden"
          value={formData.tags.join(', ')}
          onChange={(e) => onInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
        />
      </div>
    </div>
  );
};
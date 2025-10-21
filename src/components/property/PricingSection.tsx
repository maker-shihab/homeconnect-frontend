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

export const PricingSection: React.FC<Props> = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur
}) => {
  const isRental = formData.listingType === 'rent';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dynamic Price Field */}
        <div className="space-y-2">
          <Label htmlFor={isRental ? 'rentPrice' : 'salePrice'}>
            {isRental ? 'Monthly Rent *' : 'Sale Price *'}
          </Label>
          <Input
            id={isRental ? 'rentPrice' : 'salePrice'}
            type="number"
            placeholder={isRental ? "e.g., 15000" : "e.g., 5000000"}
            value={isRental ? formData.rentPrice || '' : formData.salePrice || ''}
            onChange={(e) => onInputChange(isRental ? 'rentPrice' : 'salePrice', parseFloat(e.target.value) || 0)}
            onBlur={() => onInputBlur(isRental ? 'rentPrice' : 'salePrice')}
          />
          {formErrors[isRental ? 'rentPrice' : 'salePrice'] && (
            <p className="text-sm text-red-500 mt-1">{formErrors[isRental ? 'rentPrice' : 'salePrice']}</p>
          )}
        </div>

        {/* Security Deposit (Rental) or Original Price (Sale) */}
        <div className="space-y-2">
          <Label htmlFor={isRental ? 'securityDeposit' : 'originalPrice'}>
            {isRental ? 'Security Deposit' : 'Original Price'}
          </Label>
          <Input
            id={isRental ? 'securityDeposit' : 'originalPrice'}
            type="number"
            placeholder={isRental ? "e.g., 30000" : "e.g., 5500000"}
            value={isRental ? formData.securityDeposit || '' : formData.originalPrice || ''}
            onChange={(e) => onInputChange(
              isRental ? 'securityDeposit' : 'originalPrice',
              parseFloat(e.target.value) || 0
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select value="BDT" disabled>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BDT">BDT (৳)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Rental Fields */}
      {isRental && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="utilityDeposit">Utility Deposit</Label>
            <Input
              id="utilityDeposit"
              type="number"
              placeholder="e.g., 5000"
              value={formData.utilityDeposit || ''}
              onChange={(e) => onInputChange('utilityDeposit', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenanceFee">Maintenance Fee</Label>
            <Input
              id="maintenanceFee"
              type="number"
              placeholder="e.g., 2000"
              value={formData.maintenanceFee || ''}
              onChange={(e) => onInputChange('maintenanceFee', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      )}

      {/* Sale Specific Fields */}
      {!isRental && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="priceNegotiable"
              checked={formData.priceNegotiable}
              onChange={(e) => onInputChange('priceNegotiable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="priceNegotiable">Price Negotiable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mortgageAvailable"
              checked={formData.mortgageAvailable}
              onChange={(e) => onInputChange('mortgageAvailable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="mortgageAvailable">Mortgage Available</Label>
          </div>
        </div>
      )}
    </div>
  );
};
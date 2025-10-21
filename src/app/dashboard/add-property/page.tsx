// AddPropertyForm.tsx (Main File)
'use client';

import { AvailabilitySection } from '@/components/property/AvailabilitySection';
import { BasicInformationSection } from '@/components/property/BasicInformationSection';
import { ImageUploadSection } from '@/components/property/ImageUploadSection';
import { LocationSection } from '@/components/property/LocationSection';
import { PricingSection } from '@/components/property/PricingSection';
import { SpecificationsSection } from '@/components/property/SpecificationsSection';
import { ProtectedRoute } from '@/components/protected-route';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { AlertCircle, Loader2 } from 'lucide-react';


export default function AddPropertyForm() {
  const {
    formData,
    formErrors,
    images,
    loading,
    error,
    success,
    handleInputChange,
    handleInputBlur,
    handleSelectBlur,
    handleFileChange,
    handleSubmit,
    resetForm
  } = usePropertyForm();

  return (
    <ProtectedRoute>
      <div className="flex-1 bg-gray-50 p-6">
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Add New Property</CardTitle>
              <CardDescription>
                Fill in the details below to list your property. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Alert Messages */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <BasicInformationSection
                  formData={formData}
                  formErrors={formErrors}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                  onSelectBlur={handleSelectBlur}
                />

                {/* Pricing */}
                <PricingSection
                  formData={formData}
                  formErrors={formErrors}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                />

                {/* Location */}
                <LocationSection
                  formData={formData}
                  formErrors={formErrors}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                  onSelectBlur={handleSelectBlur}
                />

                {/* Specifications */}
                <SpecificationsSection
                  formData={formData}
                  formErrors={formErrors}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                />

                {/* Availability & Additional Details */}
                <AvailabilitySection
                  formData={formData}
                  formErrors={formErrors}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                />

                {/* Image Upload */}
                <ImageUploadSection
                  images={images}
                  formErrors={formErrors}
                  onFileChange={handleFileChange}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Creating Property...' : 'Add Property'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                    Reset Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
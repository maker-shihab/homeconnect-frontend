
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormErrors } from '@/types/properties-type';

interface Props {
  images: File[];
  formErrors: FormErrors;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadSection: React.FC<Props> = ({
  images,
  formErrors,
  onFileChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Property Images</h3>

      <div className="space-y-2">
        <Label htmlFor="images">
          Upload Images (Max 10 files, 5MB each) *
        </Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
        />
        {formErrors.images && (
          <p className="text-sm text-red-500 mt-1">{formErrors.images}</p>
        )}

        {/* Selected files preview */}
        {images.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              {images.length} file(s) selected:
            </p>
            <div className="space-y-1">
              {images.map((file, index) => (
                <div key={index} className="text-sm text-gray-700 flex items-center justify-between">
                  <span>{file.name}</span>
                  <span className="text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2">
          Supported formats: JPEG, PNG, WebP. Maximum file size: 5MB per image.
        </p>
      </div>
    </div>
  );
};
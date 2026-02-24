import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateProduct } from '../hooks/useQueries';
import { ProductCategory, ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import AuthButton from '../components/AuthButton';

export default function AdminPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const createProductMutation = useCreateProduct();

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const isInitializing = loginStatus === 'initializing';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    // Validation
    if (!productId.trim()) {
      toast.error('Product ID is required');
      return;
    }
    if (!productName.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      // Convert image file to bytes
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Create ExternalBlob with upload progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Create product
      await createProductMutation.mutateAsync({
        id: productId.trim(),
        name: productName.trim(),
        category: category as ProductCategory,
        price: BigInt(Math.round(Number(price))),
        image: blob,
      });

      // Show success message
      setShowSuccess(true);
      toast.success('Product created successfully!');

      // Reset form
      setProductId('');
      setProductName('');
      setCategory('');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const isLoading = createProductMutation.isPending;

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 max-w-2xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
          </div>
        </div>
      </section>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black text-foreground md:text-4xl">
              Admin <span className="text-neon-blue">Panel</span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Secure access for product management
            </p>
          </div>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="rounded-full bg-neon-blue/10 p-6">
                  <Lock className="h-12 w-12 text-neon-blue" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Authentication Required</h3>
                  <p className="text-muted-foreground max-w-md">
                    Please log in to access the admin panel and manage your products.
                  </p>
                </div>
                <AuthButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Show admin form when authenticated
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center flex-1">
            <h2 className="mb-3 text-3xl font-black text-foreground md:text-4xl">
              Admin <span className="text-neon-blue">Panel</span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Add new products to your collection
            </p>
          </div>
          <div className="absolute right-4 top-4 sm:relative sm:right-0 sm:top-0">
            <AuthButton />
          </div>
        </div>

        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Add New Product</CardTitle>
            <CardDescription>Fill in the details to add a new product to your store</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product ID */}
              <div className="space-y-2">
                <Label htmlFor="productId" className="text-foreground">
                  Product ID
                </Label>
                <Input
                  id="productId"
                  type="text"
                  placeholder="e.g., POUCH-001"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={isLoading}
                  className="bg-background border-border/40 text-foreground"
                />
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-foreground">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="e.g., JJK Theme Pouch"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={isLoading}
                  className="bg-background border-border/40 text-foreground"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as ProductCategory)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-background border-border/40 text-foreground">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductCategory.pouch}>Pouches</SelectItem>
                    <SelectItem value={ProductCategory.keychain}>Keychains</SelectItem>
                    <SelectItem value={ProductCategory.sticker}>Stickers</SelectItem>
                    <SelectItem value={ProductCategory.poster}>Posters</SelectItem>
                    <SelectItem value={ProductCategory.others}>Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Price (PKR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isLoading}
                  min="1"
                  step="1"
                  className="bg-background border-border/40 text-foreground"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-foreground">
                  Product Image
                </Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                      className="bg-background border-border/40 text-foreground"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  {imagePreview && (
                    <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-border/40">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {isLoading && uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-neon-blue transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-neon-blue/10 p-4 text-neon-blue">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Product created successfully!</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  'Add Product'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateProduct, useDeleteProduct, useDeleteAllProducts, useGetAllProducts } from '../hooks/useQueries';
import { ProductCategory, Gender } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Lock, KeyRound, X, Plus, Image as ImageIcon, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import AuthButton from '../components/AuthButton';

const ADMIN_PASSWORD = 'Jujutsukaisenphantomparadehaha777';
const SESSION_KEY = 'admin_unlocked';

export default function AdminPage() {
  const { identity, loginStatus } = useInternetIdentity();

  // Password gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Product form state
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [price, setPrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Photos state (multi-URL + data URLs from gallery)
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // Sizes state
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const sizeInputRef = useRef<HTMLInputElement>(null);

  // Colors state
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Gender state
  const [gender, setGender] = useState<Gender>(Gender.unisex);

  // Track which product is being deleted
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  const deleteAllProductsMutation = useDeleteAllProducts();

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const isInitializing = loginStatus === 'initializing';
  const isAdminReady = !!isAuthenticated && isUnlocked;

  // Fetch products only when admin is ready
  const { data: allProducts, isLoading: productsLoading } = useGetAllProducts();

  // Sync unlock state to sessionStorage
  useEffect(() => {
    if (isUnlocked) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }, [isUnlocked]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setPasswordError('');
      setIsUnlocked(true);
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  // Photo URL handlers
  const addPhoto = () => {
    const trimmed = photoInput.trim();
    if (trimmed && !photos.includes(trimmed)) {
      setPhotos((prev) => [...prev, trimmed]);
    }
    setPhotoInput('');
    photoInputRef.current?.focus();
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPhoto();
    }
  };

  // Gallery file upload handler
  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    const fileArray = Array.from(files);
    let processed = 0;
    const newDataUrls: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          newDataUrls.push(dataUrl);
        }
        processed++;
        if (processed === fileArray.length) {
          setPhotos((prev) => [...prev, ...newDataUrls]);
          setIsProcessingFiles(false);
          toast.success(`${newDataUrls.length} photo${newDataUrls.length > 1 ? 's' : ''} added from gallery`);
        }
      };
      reader.onerror = () => {
        processed++;
        if (processed === fileArray.length) {
          setIsProcessingFiles(false);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input so same files can be re-selected
    e.target.value = '';
  };

  // Size tag handlers
  const addSize = () => {
    const trimmed = sizeInput.trim().toUpperCase();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes((prev) => [...prev, trimmed]);
    }
    setSizeInput('');
    sizeInputRef.current?.focus();
  };

  const removeSize = (size: string) => {
    setSizes((prev) => prev.filter((s) => s !== size));
  };

  const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSize();
    }
  };

  // Color tag handlers
  const addColor = () => {
    const trimmed = colorInput.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (capitalized && !colors.includes(capitalized)) {
      setColors((prev) => [...prev, capitalized]);
    }
    setColorInput('');
    colorInputRef.current?.focus();
  };

  const removeColor = (color: string) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addColor();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

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
    if (photos.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        id: productId.trim(),
        name: productName.trim(),
        description: description.trim(),
        category: category as ProductCategory,
        price: BigInt(Math.round(Number(price))),
        photos,
        imageUrl: photos[0],
        sizes,
        colors,
        gender,
      });

      setShowSuccess(true);
      toast.success('Product created successfully!');

      setProductId('');
      setProductName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setPhotos([]);
      setPhotoInput('');
      setSizes([]);
      setSizeInput('');
      setColors([]);
      setColorInput('');
      setGender(Gender.unisex);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    setDeletingProductId(id);
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success(`"${name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteAllProducts = async () => {
    try {
      await deleteAllProductsMutation.mutateAsync();
      toast.success('All products deleted successfully');
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast.error('Failed to delete all products. Please try again.');
    }
  };

  const isLoading = createProductMutation.isPending;

  // --- Password Gate ---
  if (!isUnlocked) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 max-w-md">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black text-foreground md:text-4xl">
              Admin <span className="text-neon-blue">Panel</span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Enter the password to continue
            </p>
          </div>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-full bg-neon-blue/10 p-5">
                  <KeyRound className="h-10 w-10 text-neon-blue" />
                </div>

                <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-foreground">
                      Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter admin password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      className="bg-background border-border/40 text-foreground"
                      autoFocus
                    />
                    {passwordError && (
                      <p className="text-sm font-medium text-destructive">{passwordError}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Unlock Panel
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // --- Loading state while Internet Identity initializes ---
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

  // --- Internet Identity login prompt ---
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

  // --- Admin form when fully authenticated ---
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 max-w-2xl space-y-8">
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

        {/* Add New Product Form */}
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product — materials, design details, special features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="bg-background border-border/40 text-foreground min-h-[100px] resize-y"
                  rows={4}
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

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender
                </Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setGender(value as Gender)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-background border-border/40 text-foreground">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.unisex}>Unisex</SelectItem>
                    <SelectItem value={Gender.male}>Male</SelectItem>
                    <SelectItem value={Gender.female}>Female</SelectItem>
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

              {/* Photos Section */}
              <div className="space-y-3">
                <Label className="text-foreground">
                  Photos <span className="text-muted-foreground text-xs font-normal">(first is thumbnail)</span>
                </Label>

                {/* Gallery Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryFiles}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isProcessingFiles}
                    variant="outline"
                    className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-neon-blue/60"
                  >
                    {isProcessingFiles ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isProcessingFiles ? 'Processing...' : 'Choose from Gallery'}
                  </Button>
                </div>

                {/* URL input */}
                <div className="flex gap-2">
                  <Input
                    ref={photoInputRef}
                    type="url"
                    placeholder="Or paste image URL and press Enter"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    onKeyDown={handlePhotoKeyDown}
                    disabled={isLoading}
                    className="bg-background border-border/40 text-foreground flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addPhoto}
                    disabled={isLoading || !photoInput.trim()}
                    variant="outline"
                    size="icon"
                    className="border-border/40 text-neon-blue hover:bg-neon-blue/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Photo chips */}
                {photos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {photos.map((photo, index) => {
                        const isDataUrl = photo.startsWith('data:');
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 px-3 py-1 text-xs text-neon-blue max-w-[200px]"
                          >
                            {isDataUrl ? (
                              <ImageIcon className="h-3 w-3 shrink-0" />
                            ) : null}
                            <span className="truncate">
                              {isDataUrl ? `Gallery photo ${index + 1}` : photo}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              disabled={isLoading}
                              className="ml-1 rounded-full hover:text-destructive transition-colors shrink-0"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Thumbnail preview */}
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Thumbnail preview (4:5):</p>
                      <div
                        className="rounded-lg overflow-hidden border border-border/40 bg-muted"
                        style={{ width: 80, aspectRatio: '4/5' }}
                      >
                        <img
                          src={photos[0]}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sizes Section */}
              <div className="space-y-3">
                <Label className="text-foreground">
                  Sizes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    ref={sizeInputRef}
                    type="text"
                    placeholder="e.g., S, M, L, XL"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={handleSizeKeyDown}
                    disabled={isLoading}
                    className="bg-background border-border/40 text-foreground flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addSize}
                    disabled={isLoading || !sizeInput.trim()}
                    variant="outline"
                    size="icon"
                    className="border-border/40 text-neon-blue hover:bg-neon-blue/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center gap-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 px-3 py-1 text-xs text-neon-blue"
                      >
                        <span>{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          disabled={isLoading}
                          className="ml-1 rounded-full hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors Section */}
              <div className="space-y-3">
                <Label className="text-foreground">
                  Colors <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    ref={colorInputRef}
                    type="text"
                    placeholder="e.g., Black, White, Blue"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={handleColorKeyDown}
                    disabled={isLoading}
                    className="bg-background border-border/40 text-foreground flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addColor}
                    disabled={isLoading || !colorInput.trim()}
                    variant="outline"
                    size="icon"
                    className="border-border/40 text-neon-blue hover:bg-neon-blue/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 px-3 py-1 text-xs text-neon-blue"
                      >
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          disabled={isLoading}
                          className="ml-1 rounded-full hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : showSuccess ? (
                  <>
                    <span className="mr-2">✓</span>
                    Product Created!
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Manage Existing Products */}
        {isAdminReady && (
          <Card className="border-border/40 bg-card">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-2xl text-foreground">Manage Products</CardTitle>
                <CardDescription>
                  {productsLoading
                    ? 'Loading products...'
                    : `${allProducts?.length ?? 0} product${(allProducts?.length ?? 0) !== 1 ? 's' : ''} in store`}
                </CardDescription>
              </div>

              {/* Delete All Products Button */}
              {(allProducts?.length ?? 0) > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={deleteAllProductsMutation.isPending}
                      className="bg-red-700 hover:bg-red-600 text-white border-0 shrink-0"
                    >
                      {deleteAllProductsMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <AlertTriangle className="mr-2 h-4 w-4" />
                      )}
                      Delete All Products
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border/40">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete All Products?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete <strong className="text-foreground">all {allProducts?.length} products</strong> from your store. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-border/40 text-foreground hover:bg-muted">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAllProducts}
                        className="bg-red-700 hover:bg-red-600 text-white"
                      >
                        Yes, Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardHeader>

            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />
                </div>
              ) : !allProducts || allProducts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No products yet. Add your first product above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allProducts.map((product) => {
                    const isDeleting = deletingProductId === product.id && deleteProductMutation.isPending;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/50 p-3 hover:border-border/60 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div
                          className="rounded overflow-hidden bg-muted shrink-0 border border-border/20"
                          style={{ width: 44, aspectRatio: '4/5' }}
                        >
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-neon-blue font-medium">PKR {Number(product.price).toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground font-mono">{product.id}</span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting || deleteAllProductsMutation.isPending}
                              className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border/40">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Delete Product?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete <strong className="text-foreground">"{product.name}"</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border/40 text-foreground hover:bg-muted">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-700 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

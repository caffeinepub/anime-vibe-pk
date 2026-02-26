# Specification

## Summary
**Goal:** Change all product image displays across the site to use a square 1:1 aspect ratio instead of the previous 4:5 ratio.

**Planned changes:**
- Update `ProductCard.tsx` to render product images with `aspect-ratio: 1/1` and `object-fit: cover`
- Update `PhotoGallery.tsx` primary image and thumbnail strip to use `aspect-ratio: 1/1` and `object-fit: cover`
- Update `ProductDetailModal.tsx` to render product images with `aspect-ratio: 1/1` and `object-fit: cover`
- Remove all instances of the old 4:5 ratio from product image containers

**User-visible outcome:** All product images across the site display as perfect squares on both mobile and desktop, filling their containers without distortion.

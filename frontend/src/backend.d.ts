import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
    sizes: Array<string>;
    imageUrl: string;
    gender: Gender;
    category: ProductCategory;
    colors: Array<string>;
    price: bigint;
    photos: Array<string>;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    id: bigint;
    createdAt: bigint;
    productId: bigint;
    reviewerName: string;
    comment: string;
    rating: bigint;
}
export enum Gender {
    female = "female",
    male = "male",
    unisex = "unisex"
}
export enum ProductCategory {
    others = "others",
    sticker = "sticker",
    pouch = "pouch",
    keychain = "keychain",
    poster = "poster"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(productId: bigint, reviewerName: string, rating: bigint, comment: string): Promise<Review>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(id: string, name: string, description: string, category: ProductCategory, price: bigint, photos: Array<string>, imageUrl: string, sizes: Array<string>, colors: Array<string>, gender: Gender): Promise<Product>;
    deleteAllProducts(): Promise<void>;
    deleteProduct(id: string): Promise<boolean>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: string): Promise<Product | null>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getReviewsByProduct(productId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

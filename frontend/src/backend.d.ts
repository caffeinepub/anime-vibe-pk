import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Product {
    id: string;
    name: string;
    createdAt: Time;
    category: ProductCategory;
    image: ExternalBlob;
    price: bigint;
}
export enum ProductCategory {
    others = "others",
    sticker = "sticker",
    pouch = "pouch",
    keychain = "keychain",
    poster = "poster"
}
export interface backendInterface {
    createProduct(id: string, name: string, category: ProductCategory, price: bigint, image: ExternalBlob): Promise<Product>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(id: string): Promise<Product | null>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
}

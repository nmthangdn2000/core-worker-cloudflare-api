export type TVariant = {
  variantOption: string;
  children?: TVariant[];
  price?: number;
  discount?: number;
  stock?: number;
  fileIds?: string;
};

export enum SORT_KEY_PRODUCT {
  NAME = "name",
  PRICE = "price",
  CREATED_AT = "createdAt",
}

export enum STATUS_PRODUCT {
  DRAFT = "draft",
  PUBLISHED = "published",
}

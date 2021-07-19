export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
} 

export const products: Product[] = [
    {
      id: "1",
      name: "My product 1",
      description: "Very nice product",
      price: 80.49,
      image_url: "https://source.unsplash.com/800x600",
      slug: "product-slug-here1",
      created_at: "some date here",
    },
    {
      id: "1",
      name: "My product 1",
      description: "Very nice product",
      price: 80.49,
      image_url: "https://source.unsplash.com/random",
      slug: "product-slug-here2",
      created_at: "some date here",
    },
  ];

export default function ProductDetailPage() {
    return null
}
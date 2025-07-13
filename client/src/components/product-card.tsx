import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { ApiProduct } from "@/types/furniture";

interface ProductCardProps {
  product: any;
  collectionId: number;
}

export function ProductCard({ product, collectionId }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  return (
    <Card className="overflow-hidden card-hover cursor-pointer border-0 shadow-lg bg-white animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
          alt={product.label || product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.label || product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || product.subcategory?.label || "Премиальная мебель"}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">
            {product.subcategory?.label}
          </span>
          <span className="text-xs text-gray-500">
            ID: {product.id}
          </span>
        </div>
        <Link href={`/configurator?product=${product.id}&collection=${collectionId}&subcategory=${product.subcategory?.id}`}>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-white font-semibold py-3 rounded-lg shadow-lg">
            Настроить
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { furnitureApi } from "@/lib/api";
import { ChevronRight, Filter } from "lucide-react";

export default function Collections() {
  const [, params] = useRoute("/collections/:id");
  const collectionId = params?.id ? parseInt(params.id) : null;

  const { data: collections } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: () => furnitureApi.getCollections(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/collections', collectionId, 'products'],
    queryFn: () => furnitureApi.getCollectionProducts(collectionId!),
    enabled: !!collectionId,
  });

  const currentCollection = collections?.find(c => c.id === collectionId);

  if (!collectionId || !currentCollection) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Коллекция не найдена</h2>
            <p className="text-gray-600">Запрашиваемая коллекция не найдена.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-600">Главная</a>
        <ChevronRight className="h-4 w-4" />
        <a href="/collections" className="hover:text-blue-600">Коллекции</a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{currentCollection.label || currentCollection.name}</span>
      </nav>

      {/* Collection Header */}
      <Card className="overflow-hidden card-hover border-0 shadow-lg">
        <div className="h-48 bg-gradient-primary relative">
          <img 
            src={currentCollection.image_url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"}
            alt={currentCollection.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-2">{currentCollection.label || currentCollection.name}</h1>
              <p className="text-xl opacity-90">
                {currentCollection.description || currentCollection.category?.label || "Изучите нашу премиальную коллекцию мебели"}
              </p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  {products?.length || currentCollection.product_count || 0}
                </div>
                <div className="text-sm text-gray-600">Товаров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">156</div>
                <div className="text-sm text-gray-600">Конфигураций</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">$1,200 - $4,500</div>
                <div className="text-sm text-gray-600">Диапазон цен</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Сортировка по цене" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="popularity">По популярности</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-3"></div>
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              collectionId={collectionId}
            />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-6">
              <Package className="w-20 h-20 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-gradient mb-4">Товары не найдены</h3>
            <p className="text-gray-600 text-lg">В этой коллекции пока нет товаров.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

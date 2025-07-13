import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { PriceCalculator } from "@/components/price-calculator";
import { furnitureApi } from "@/lib/api";
import { ChevronRight } from "lucide-react";
import type { ConfigurationState } from "@/types/furniture";

export default function Configurator() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1] || '');
  const productId = parseInt(queryParams.get('product') || '1');
  const collectionId = parseInt(queryParams.get('collection') || '1');
  const subcategoryId = parseInt(queryParams.get('subcategory') || '1');

  const [configuration, setConfiguration] = useState<ConfigurationState>({
    productId: productId || 0,
    mechanismIds: [],
    quantity: 1,
  });

  // Get collection products
  const { data: products } = useQuery({
    queryKey: ['/api/collections', collectionId, 'products'],
    queryFn: () => furnitureApi.getCollectionProducts(collectionId),
    enabled: !!collectionId,
  });

  const product = products?.find(p => p.id === productId);

  // Get product configurations
  const { data: configurations } = useQuery({
    queryKey: ['/api/products', productId, 'configurations', subcategoryId],
    queryFn: () => furnitureApi.getProductConfigurations(productId, subcategoryId),
    enabled: !!productId && !!subcategoryId,
  });

  const handleConfigurationChange = (changes: Partial<ConfigurationState>) => {
    setConfiguration(prev => ({ ...prev, ...changes }));
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", configuration);
  };

  const handleSaveConfiguration = () => {
    // TODO: Implement save configuration functionality
    console.log("Save configuration:", configuration);
  };

  const handleRequestQuote = () => {
    // TODO: Implement request quote functionality
    console.log("Request quote:", configuration);
  };

  if (!productId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Товар не выбран</h2>
            <p className="text-gray-600">Пожалуйста, выберите товар для настройки.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-600">Главная</a>
        <ChevronRight className="h-4 w-4" />
        <a href="/collections" className="hover:text-blue-600">Коллекции</a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Настройка {product?.label || product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Preview & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Preview */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{product?.label || product?.name || "Загрузка..."}</CardTitle>
              <p className="text-gray-600">
                {product?.description || product?.subcategory?.label || "Премиальная мебель с настраиваемыми опциями"}
              </p>
            </CardHeader>
            
            <div className="aspect-video overflow-hidden">
              <img 
                src={product?.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600"}
                alt={product?.label || product?.name || "Предварительный просмотр товара"}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Product thumbnails for different configurations */}
                {[1, 2, 3, 4].map((i) => (
                  <button 
                    key={i}
                    className={`aspect-square border-2 rounded-lg overflow-hidden transition-colors ${
                      i === 1 ? 'border-blue-600' : 'border-gray-200 hover:border-blue-600'
                    }`}
                  >
                    <img 
                      src={`https://images.unsplash.com/photo-${
                        i === 1 ? '1555041469-a586c61ea9bc' :
                        i === 2 ? '1567538096630-e0c55bd6374c' :
                        i === 3 ? '1506439773649-6e0eb8cfb237' :
                        '1586023492125-27b2c045efd7'
                      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`}
                      alt={`Configuration ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Panel */}
          <ConfigurationPanel
            productId={productId}
            configuration={configuration}
            onConfigurationChange={handleConfigurationChange}
          />
        </div>

        {/* Price Calculator Sidebar */}
        <div>
          <PriceCalculator
            configuration={configuration}
            onAddToCart={handleAddToCart}
            onSaveConfiguration={handleSaveConfiguration}
            onRequestQuote={handleRequestQuote}
          />
        </div>
      </div>
    </div>
  );
}

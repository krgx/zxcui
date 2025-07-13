import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { furnitureApi } from "@/lib/api";
import { Layers, Package, Settings, DollarSign } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: () => furnitureApi.getCollections(),
  });

  const totalProducts = collections?.reduce((sum, collection) => sum + (collection.product_count || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего коллекций</p>
                <p className="text-3xl font-bold text-gradient">
                  {isLoading ? "..." : collections?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Товаров</p>
                <p className="text-3xl font-bold text-gradient">
                  {isLoading ? "..." : totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Конфигураций</p>
                <p className="text-3xl font-bold text-gradient">1,523</p>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Средняя цена</p>
                <p className="text-3xl font-bold text-gradient">$2,840</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Collections */}
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient">Рекомендуемые коллекции</CardTitle>
          <p className="text-sm text-gray-600">Популярные коллекции мебели</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections?.slice(0, 6).map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 mb-4">
                      <img 
                        src={collection.image_url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{collection.label || collection.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {collection.description || "Изучите нашу коллекцию премиальной мебели"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {collection.product_count || 0} товаров
                      </span>
                      <span className="text-sm text-gray-500">Открыть коллекцию</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

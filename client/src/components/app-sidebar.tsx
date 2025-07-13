import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LayoutDashboard, Layers, Calculator, Settings, Wifi } from "lucide-react";
import { furnitureApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const [location] = useLocation();
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: () => furnitureApi.getCollections(),
  });

  const isActive = (path: string) => location === path || location.startsWith(path);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out pt-16 lg:pt-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Навигация</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link href="/">
              <Button 
                variant={isActive('/') && location === '/' ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Панель управления
              </Button>
            </Link>
            
            <Collapsible open={collectionsOpen} onOpenChange={setCollectionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center">
                    <Layers className="mr-3 h-4 w-4" />
                    Коллекции
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    collectionsOpen && "transform rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="ml-7 space-y-1">
                {isLoading && (
                  <div className="text-sm text-gray-500 py-1">Загрузка...</div>
                )}
                {error && (
                  <div className="text-sm text-red-500 py-1">Ошибка загрузки коллекций</div>
                )}
                {collections?.map((collection) => (
                  <Link key={collection.id} href={`/collections/${collection.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={cn(
                        "w-full justify-start text-sm",
                        isActive(`/collections/${collection.id}`) && "bg-blue-50 text-blue-600"
                      )}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                    >
                      {collection.label || collection.name}
                    </Button>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Link href="/calculator">
              <Button 
                variant={isActive('/calculator') ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <Calculator className="mr-3 h-4 w-4" />
                Калькулятор цен
              </Button>
            </Link>
            
            <Link href="/configurator">
              <Button 
                variant={isActive('/configurator') ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <Settings className="mr-3 h-4 w-4" />
                Конфигуратор
              </Button>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Wifi className="h-4 w-4" />
              <span>Статус API: Подключено</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

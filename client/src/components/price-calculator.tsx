import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { furnitureApi } from "@/lib/api";
import type { ConfigurationState, PriceCalculationRes } from "@/types/furniture";

interface PriceCalculatorProps {
  configuration: ConfigurationState;
  onAddToCart?: () => void;
  onSaveConfiguration?: () => void;
  onRequestQuote?: () => void;
}

export function PriceCalculator({ 
  configuration, 
  onAddToCart, 
  onSaveConfiguration, 
  onRequestQuote 
}: PriceCalculatorProps) {
  const [priceData, setPriceData] = useState<PriceCalculationRes | null>(null);

  const priceMutation = useMutation({
    mutationFn: furnitureApi.calculatePrice,
    onSuccess: (data) => {
      setPriceData(data);
    },
  });

  useEffect(() => {
    if (configuration.productId) {
      priceMutation.mutate({
        product_id: configuration.productId,
        configuration_id: configuration.configurationId,
        material_id: configuration.materialId,
        mechanism_ids: configuration.mechanismIds,
        quantity: configuration.quantity,
      });
    }
  }, [configuration]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  return (
    <div className="space-y-6">
      {/* Price Summary */}
      <Card className="sticky top-6 border-0 shadow-lg card-hover">
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <CardTitle className="text-lg">Калькулятор цен</CardTitle>
          <div className="text-3xl font-bold">
            {priceData ? formatPrice(priceData.total) : "$0.00"}
          </div>
          <div className="text-sm opacity-90">Общая ориентировочная цена</div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {priceMutation.isLoading && (
            <div className="text-center text-gray-500">Расчет...</div>
          )}
          
          {priceData && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Базовая цена</span>
                <span className="font-medium">{formatPrice(priceData.base_price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Стоимость материала</span>
                <span className="font-medium">+{formatPrice(priceData.material_cost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Механизмы</span>
                <span className="font-medium">+{formatPrice(priceData.mechanism_cost)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Итого</span>
                  <span className="text-blue-600">{formatPrice(priceData.total)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <div className="p-6 pt-0 space-y-3">
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-white font-semibold py-3 rounded-lg shadow-lg" 
            onClick={onAddToCart}
            disabled={!priceData}
          >
            В корзину
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 py-3" 
            onClick={onSaveConfiguration}
            disabled={!priceData}
          >
            Сохранить конфигурацию
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3" 
            onClick={onRequestQuote}
            disabled={!priceData}
          >
            Запросить предложение
          </Button>
        </div>
      </Card>

      {/* Configuration Summary */}
      <Card className="border-0 shadow-lg card-hover">
        <CardHeader>
          <CardTitle className="text-lg text-gradient">Сводка конфигурации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">ID товара:</span>
            <span className="font-medium">{configuration.productId}</span>
          </div>
          {configuration.configurationId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Конфигурация:</span>
              <span className="font-medium">{configuration.configurationId}</span>
            </div>
          )}
          {configuration.materialId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Материал:</span>
              <span className="font-medium">{configuration.materialId}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Механизмы:</span>
            <span className="font-medium">{configuration.mechanismIds.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Количество:</span>
            <span className="font-medium">{configuration.quantity}</span>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-success rounded-full animate-pulse"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">API подключен</div>
              <div className="text-xs text-gray-600">Расчет цен в реальном времени</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

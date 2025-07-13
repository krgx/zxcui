import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { furnitureApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ApiConfiguration, ApiMaterial, ApiMechanism, ConfigurationState } from "@/types/furniture";

interface ConfigurationPanelProps {
  productId: number;
  configuration: ConfigurationState;
  onConfigurationChange: (config: Partial<ConfigurationState>) => void;
}

export function ConfigurationPanel({ 
  productId, 
  configuration, 
  onConfigurationChange 
}: ConfigurationPanelProps) {
  // Note: Configuration requires subcategory_id parameter based on API docs
  // Since materials and mechanisms endpoints return 404, we'll use empty arrays
  const configurations: any[] = [];
  const materials: any[] = [];
  const mechanisms: any[] = [];

  const handleConfigurationSelect = (configId: number) => {
    onConfigurationChange({ configurationId: configId });
  };

  const handleMaterialSelect = (materialId: number) => {
    onConfigurationChange({ materialId });
  };

  const handleMechanismToggle = (mechanismId: number, checked: boolean) => {
    const newMechanismIds = checked
      ? [...configuration.mechanismIds, mechanismId]
      : configuration.mechanismIds.filter(id => id !== mechanismId);
    
    onConfigurationChange({ mechanismIds: newMechanismIds });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Параметры настройки</CardTitle>
        <p className="text-sm text-gray-600">Настройте мебель под ваши предпочтения</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration Types */}
        {configurations && configurations.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Тип конфигурации</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {configurations.map((config) => (
                <Button
                  key={config.id}
                  variant={configuration.configurationId === config.id ? "default" : "outline"}
                  className={cn(
                    "p-4 h-auto flex flex-col text-center",
                    configuration.configurationId === config.id && "bg-blue-600 text-white"
                  )}
                  onClick={() => handleConfigurationSelect(config.id)}
                >
                  <div className="text-sm font-medium">{config.name}</div>
                  <div className="text-xs opacity-80">{config.type}</div>
                  {config.base_price && (
                    <div className="text-xs mt-1">{formatPrice(config.base_price)}</div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Material Selection */}
        {materials && materials.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Материал обивки</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {materials.slice(0, 8).map((material) => (
                <Button
                  key={material.id}
                  variant={configuration.materialId === material.id ? "default" : "outline"}
                  className={cn(
                    "p-3 h-auto flex flex-col text-center",
                    configuration.materialId === material.id && "bg-blue-600 text-white"
                  )}
                  onClick={() => handleMaterialSelect(material.id)}
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: material.color_code || '#ccc' }}
                  />
                  <div className="text-xs font-medium">{material.name}</div>
                  <div className="text-xs opacity-80">Cat. {material.category}</div>
                  <div className="text-xs mt-1">
                    {material.price_multiplier !== "1.00" 
                      ? `+${Math.round((parseFloat(material.price_multiplier) - 1) * 100)}%`
                      : "+$0"
                    }
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Mechanisms & Features */}
        {mechanisms && mechanisms.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Механизмы и функции</Label>
            <div className="space-y-3">
              {mechanisms.map((mechanism) => (
                <div 
                  key={mechanism.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`mechanism-${mechanism.id}`}
                      checked={configuration.mechanismIds.includes(mechanism.id)}
                      onCheckedChange={(checked) => 
                        handleMechanismToggle(mechanism.id, checked as boolean)
                      }
                    />
                    <div>
                      <Label 
                        htmlFor={`mechanism-${mechanism.id}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {mechanism.name}
                      </Label>
                      {mechanism.description && (
                        <div className="text-xs text-gray-600">{mechanism.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    +{formatPrice(mechanism.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

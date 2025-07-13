import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { furnitureApi } from "@/lib/api";
import type { PriceBreakdown } from "@/types/furniture";

export default function Calculator() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [calculation, setCalculation] = useState<PriceBreakdown | null>(null);

  const { data: collections } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: () => furnitureApi.getCollections(),
  });

  // For simplicity, we'll show some sample products
  // In a real app, you'd fetch all products or have a search interface
  const sampleProducts = [
    { id: 1, name: "Modern Sectional", price: 2450 },
    { id: 2, name: "Contemporary Loveseat", price: 1250 },
    { id: 3, name: "Power Recliner", price: 1890 },
    { id: 4, name: "Modular System", price: 3200 },
    { id: 5, name: "Dining Chair Set", price: 890 },
    { id: 6, name: "Storage Ottoman", price: 340 },
  ];

  const handleProductToggle = (productId: number, checked: boolean) => {
    setSelectedProducts(prev => 
      checked 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const calculatePrice = () => {
    const selectedItems = sampleProducts.filter(p => selectedProducts.includes(p.id));
    const subtotal = selectedItems.reduce((sum, product) => sum + product.price, 0) * quantity;
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * 0.08; // 8% tax
    const total = afterDiscount + tax;

    setCalculation({
      basePrice: subtotal,
      materialCost: 0,
      mechanismCost: 0,
      subtotal,
      discount: discountAmount,
      tax,
      total,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Price Calculator</CardTitle>
          <p className="text-gray-600">Calculate custom pricing for bulk orders and special configurations</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Product Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Products</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {sampleProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox 
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => 
                          handleProductToggle(product.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`product-${product.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {product.name} - {formatPrice(product.price)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantity
                </Label>
                <Input 
                  id="quantity"
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              {/* Discount */}
              <div>
                <Label htmlFor="discount" className="text-sm font-medium text-gray-700 mb-2 block">
                  Discount Percentage
                </Label>
                <Input 
                  id="discount"
                  type="number" 
                  min="0" 
                  max="100" 
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={calculatePrice}
                disabled={selectedProducts.length === 0}
              >
                Calculate Total Price
              </Button>
            </div>
            
            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {calculation ? formatPrice(calculation.subtotal) : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">
                    -{calculation ? formatPrice(calculation.discount) : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">
                    {calculation ? formatPrice(calculation.tax) : "$0.00"}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {calculation ? formatPrice(calculation.total) : "$0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {calculation && selectedProducts.length > 0 && (
                <div className="mt-6 p-4 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Items:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {sampleProducts
                      .filter(p => selectedProducts.includes(p.id))
                      .map(product => (
                        <li key={product.id}>
                          {product.name} × {quantity} = {formatPrice(product.price * quantity)}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

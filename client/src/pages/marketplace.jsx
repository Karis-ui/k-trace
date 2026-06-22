import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ShoppingCart, Coffee, Package } from "lucide-react";

// Import images from assets/market
import seedlingsImg from "../assets/market/seedlings.jpg";
import fertilizerImg from "../assets/market/fertilizer.jpg";
import pulperImg from "../assets/market/pulper.jpg";
import moistureMeterImg from "../assets/market/moisture-meter.jpg";

// Mock coffee-specific products
const coffeeProducts = [
  {
    id: 1,
    name: "Certified Coffee Seedlings",
    category: "Seedlings",
    supplier: "Kahawa Co-op",
    description:
      "Disease-resistant seedlings certified by the Coffee Research Institute.",
    price: 120, // KSh per seedling
    unit: "per seedling",
    image: seedlingsImg,
  },
  {
    id: 2,
    name: "Organic Coffee Fertilizer",
    category: "Fertilizer",
    supplier: "AgriGreen Ltd",
    description:
      "Eco-friendly fertilizer blend designed for coffee plants, boosting yields sustainably.",
    price: 3500, // KSh per 50kg bag
    unit: "per 50kg bag",
    image: fertilizerImg,
  },
  {
    id: 3,
    name: "Coffee Pulping Machine",
    category: "Equipment",
    supplier: "TraceMachinery",
    description:
      "Durable hand-operated pulping machine suitable for smallholder farmers.",
    price: 48000, // KSh per unit
    unit: "per unit",
    image: pulperImg,
  },
  {
    id: 4,
    name: "Moisture Meter",
    category: "Quality Tools",
    supplier: "Kahawa Trace",
    description:
      "Portable device for measuring bean moisture, ensuring quality and compliance.",
    price: 18000, // KSh per unit
    unit: "per unit",
    image: moistureMeterImg,
  },
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("inputs");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green2">Kahawa Trace Marketplace</h1>
      <p className="text-gray-600">
        Access trusted coffee inputs, certified equipment, and farmer-to-farmer resources—all in one place.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inputs">Coffee Inputs</TabsTrigger>
          <TabsTrigger value="equipment">Equipment & Tools</TabsTrigger>
        </TabsList>

        {/* Coffee Inputs */}
        <TabsContent value="inputs" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-green2" />
                Coffee Inputs
              </CardTitle>
              <CardDescription>
                Find certified seedlings, organic fertilizers, and traceability-compliant products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeProducts
                  .filter((p) => p.category !== "Equipment" && p.category !== "Quality Tools")
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="shadow-soft hover:shadow-lg transition">
                        <CardHeader className="pb-3">
                          <div className="aspect-square bg-gradient-to-br from-green1 to-green3 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <Badge variant="secondary">{product.supplier}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="mb-3">
                            {product.description}
                          </CardDescription>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-xl font-bold text-green2">
                                KSh {product.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                /{product.unit}
                              </span>
                            </div>
                          </div>
                          <Button className="w-full bg-green2 hover:bg-green3">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment */}
        <TabsContent value="equipment" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green2" />
                Coffee Equipment
              </CardTitle>
              <CardDescription>
                Explore pulping machines, drying beds, and tools that improve quality and traceability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeProducts
                  .filter((p) => p.category === "Equipment" || p.category === "Quality Tools")
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="shadow-soft hover:shadow-lg transition">
                        <CardHeader className="pb-3">
                          <div className="aspect-square bg-gradient-to-br from-green1 to-green3 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <Badge variant="secondary">{product.supplier}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="mb-3">
                            {product.description}
                          </CardDescription>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-xl font-bold text-green2">
                                KSh {product.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                /{product.unit}
                              </span>
                            </div>
                          </div>
                          <Button className="w-full bg-green2 hover:bg-green3">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

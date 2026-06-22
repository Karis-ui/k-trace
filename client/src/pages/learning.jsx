import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  Download, 
  Search, 
  Star,
  Clock,
  User,
  Play,
  FileText
} from "lucide-react";
import { mockResources } from "../data/mockData";

export default function Learning() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Topics" },
    { value: "sustainability", label: "Sustainability" },
    { value: "pest-control", label: "Pest Control" },
    { value: "irrigation", label: "Irrigation" },
    { value: "soil-management", label: "Soil Management" },
    { value: "crop-rotation", label: "Crop Rotation" },
    { value: "livestock", label: "Livestock Care" },
  ];

  // For now use mockResources; fallback to a few examples if not defined
  const resources = mockResources || [
    {
      id: "1",
      title: "Sustainable Farming Techniques",
      description: "Complete guide to eco-friendly farming methods.",
      category: "sustainability",
      type: "article",
      content: "Learn about organic farming, composting, and natural pest control methods.",
      image: "/placeholder.svg",
      createdAt: "2024-01-15",
      duration: "15 min read",
      author: "Dr. Green Fields",
      rating: 4.8,
      downloads: 1250,
    },
    {
      id: "2",
      title: "Modern Irrigation Systems",
      description: "How to implement efficient water management in your farm.",
      category: "irrigation",
      type: "video",
      content: "Step-by-step video on drip irrigation and sprinkler systems.",
      image: "/placeholder.svg",
      createdAt: "2024-02-01",
      duration: "12 min",
      author: "Irrigation Expert",
      rating: 4.6,
      downloads: 890,
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Hub</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search learning resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs by Resource Type */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <Card key={res.id} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {res.type === "video" ? <Play className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                  {res.title}
                </CardTitle>
                <CardDescription>{res.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-4 h-4" /> {res.author}
                  <Clock className="w-4 h-4" /> {res.duration}
                  <Star className="w-4 h-4 text-yellow-500" /> {res.rating}
                  <Download className="w-4 h-4" /> {res.downloads}
                </div>
                <Button variant="outline" size="sm" className="mt-3">
                  View {res.type === "video" ? "Video" : "Article"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ThumbsUp, MessageCircle, Plus } from "lucide-react";
import { mockForumPosts } from "../data/mockData";
import { useToast, toast} from "../hooks/use-toast";

export default function Forum() {
  const { toast } = useToast();

  // ✅ Ensure posts is an array, not undefined
  const [posts, setPosts] = useState(Array.isArray(mockForumPosts) ? mockForumPosts : []);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "crop-farming", label: "Crop Farming" },
    { value: "livestock", label: "Livestock" },
    { value: "agrochemicals", label: "Agrochemicals" },
    { value: "machinery", label: "Machinery" },
    { value: "general", label: "General Advice" },
  ];

  const filteredPosts = posts.filter((post) => {
    const query = (searchTerm || "").toLowerCase();

    const matchesSearch =
      (post?.title || "").toLowerCase().includes(query) ||
      (post?.content || "").toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "all" || post?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return toast({
        title: "Error",
        description: "Title and content cannot be empty.",
        variant: "destructive",
      });
    }

    const post = {
      id: Date.now().toString(),
      authorId: "1",
      authorName: "John Farmer",
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      likes: 0,
      comments: [], // ✅ Always an array
      createdAt: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "general" });

    toast({
      title: "Post Created",
      description: "Your forum post has been published successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community Forum</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Write your post here..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />
              <Select
                value={newPost.category}
                onValueChange={(value) =>
                  setNewPost({ ...newPost, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreatePost}>Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  Posted by {post.authorName} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3">{post.content}</p>
                <Badge>{post.category}</Badge>
                <div className="flex gap-3 mt-4">
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="w-4 h-4 mr-2" /> {post.likes ?? 0} Likes
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />{" "}
                    {post.comments?.length ?? 0} Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}

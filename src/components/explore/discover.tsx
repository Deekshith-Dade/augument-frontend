import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Clock, BookOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

// Define article interface
interface Article {
  id: number;
  title: string;
  excerpt: string;
  authors: string[];
  imageUrl: string;
  readTime?: string;
  category?: string;
  url: string;
  publishedDate?: string;
}

export default function Discover() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(3);
  const [disabled, setDisabled] = useState(false);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/articles/discover?limit=${limit}&offset=${
          page * limit
        }`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (data.articles.length === 0) {
        setDisabled(true);
      }
      setArticles((prev) => {
        const newArticles = data.articles || [];
        return [
          ...prev,
          ...newArticles.filter(
            (article: Article) => !prev.some((p) => p.url === article.url)
          ),
        ];
      });
      setLoading(false);
    };
    fetchArticles();
  }, [page, limit, getToken]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light text-gray-800 mb-1">Discover</h2>
            <p className="text-sm text-gray-500 font-light">
              Curated articles to expand your thinking
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-gray-200/60 text-gray-600 text-xs"
          >
            {articles.length} articles
          </Badge>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="border-gray-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
            onClick={() => window.open(article.url, "_blank")}
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Image Strip */}
                <div className="w-24 h-20 flex-shrink-0 relative overflow-hidden">
                  <Image
                    src={article.imageUrl || "/placeholder.png"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={96}
                    height={120}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      {/* Title and Category */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-800 leading-snug line-clamp-2 text-sm group-hover:text-gray-900 transition-colors flex-1">
                          {article.title}
                        </h3>
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-xs ml-2 flex-shrink-0">
                          {article.category}
                        </Badge>
                      </div>

                      {/* Excerpt */}
                      <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            {article.authors && article.authors.length > 0 && (
                              <>
                                <User className="w-3 h-3" />
                                <span className="truncate max-w-24">
                                  {article.authors.length > 1
                                    ? `${article.authors[0]} +${
                                        article.authors.length - 1
                                      }`
                                    : article.authors[0]}
                                </span>
                                <span>•</span>
                              </>
                            )}
                          </div>

                          {article.readTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                              <span>•</span>
                            </div>
                          )}

                          {article.publishedDate && (
                            <span>{article.publishedDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="border-gray-200/60 text-sm"
          onClick={() => setPage(page + 1)}
          disabled={disabled}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <BookOpen className="w-4 h-4 mr-2" />
          )}
          Load More Articles
        </Button>
      </div>
    </div>
  );
}

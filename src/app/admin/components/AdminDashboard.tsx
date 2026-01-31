"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  Code,
  Image as ImageIcon,
  Search,
  X,
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

type GenerationStatus = "idle" | "generating" | "success" | "error" | "saving";

interface GenerationResult {
  success?: boolean;
  message?: string;
  slug?: string;
  filePath?: string;
  content?: string;
  error?: string;
  fileExists?: boolean;
}

interface PexelsPhoto {
  id: number;
  url: string;
  originalUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  width: number;
  height: number;
}

interface SelectedImage {
  photo: PexelsPhoto;
  imagePath?: string;
  processed?: boolean;
}

interface UrlValidationResult {
  url: string;
  valid: boolean;
  status?: number;
  error?: string;
  linkContext?: string;
  suggestedReplacement?: {
    url: string;
    title: string;
    snippet: string;
  };
}

interface UrlValidationResponse {
  success: boolean;
  results: UrlValidationResult[];
  totalUrls: number;
  validUrls: number;
  invalidUrls: number;
  fixableUrls: number;
  message: string;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [previewMode, setPreviewMode] = useState<"code" | "rendered">(
    "rendered",
  );
  const [editedContent, setEditedContent] = useState<string>("");

  // Image search state
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageSearchResults, setImageSearchResults] = useState<PexelsPhoto[]>(
    [],
  );
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // URL validation state
  const [urlValidation, setUrlValidation] =
    useState<UrlValidationResponse | null>(null);
  const [isValidatingUrls, setIsValidatingUrls] = useState(false);

  const handleGenerateArticle = async () => {
    if (!topic.trim()) return;

    setStatus("generating");
    setResult(null);
    setEditedContent("");
    setSelectedImage(null);
    setImageSearchResults([]);
    setImageSearchQuery("");
    setUrlValidation(null);

    try {
      const res = await fetch("/api/admin/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setResult(data);
        return;
      }

      setStatus("success");
      setResult(data);
      setEditedContent(data.content || "");
      setTopic("");

      // Automatically validate URLs after generation
      if (data.content) {
        validateUrls(data.content);
      }
    } catch (error) {
      setStatus("error");
      setResult({
        error: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleApprove = async () => {
    if (!result?.slug || !editedContent) return;

    setStatus("saving");

    try {
      const res = await fetch("/api/admin/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: result.slug,
          content: editedContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setResult({ ...result, error: data.error });
        return;
      }

      // Show success and clear after a delay
      setResult({ ...result, ...data });
      setTimeout(() => {
        setStatus("idle");
        setResult(null);
        setEditedContent("");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setResult({
        ...result,
        error:
          error instanceof Error ? error.message : "Failed to save article",
      });
    }
  };

  // Search Pexels for images
  const handleImageSearch = async () => {
    if (!imageSearchQuery.trim()) return;

    setIsSearchingImages(true);
    setImageError("");
    setSelectedImage(null);

    try {
      const res = await fetch(
        `/api/admin/search-images?query=${encodeURIComponent(imageSearchQuery)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setImageError(data.error || "Failed to search images");
        return;
      }

      setImageSearchResults(data.photos || []);
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Failed to search images",
      );
    } finally {
      setIsSearchingImages(false);
    }
  };

  // Process and approve selected image
  const handleApproveImage = async () => {
    if (!selectedImage || !result?.slug) return;

    setIsProcessingImage(true);
    setImageError("");

    try {
      const res = await fetch("/api/admin/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: selectedImage.photo.originalUrl,
          slug: result.slug,
          photographer: selectedImage.photo.photographer,
          photographerUrl: selectedImage.photo.photographerUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setImageError(data.error || "Failed to process image");
        return;
      }

      // Update the frontmatter in editedContent with image data
      const updatedContent = updateFrontmatterWithImage(
        editedContent,
        data.image,
        data.imageCreditName,
        data.imageCreditUrl,
      );
      setEditedContent(updatedContent);

      setSelectedImage({
        ...selectedImage,
        imagePath: data.image,
        processed: true,
      });

      // Clear search results after successful processing
      setImageSearchResults([]);
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Failed to process image",
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Validate reference URLs
  const validateUrls = async (content?: string) => {
    const contentToValidate = content || editedContent;
    if (!contentToValidate) return;

    setIsValidatingUrls(true);
    setUrlValidation(null);

    try {
      const res = await fetch("/api/admin/validate-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToValidate }),
      });

      const data = await res.json();

      if (res.ok) {
        setUrlValidation(data);
      }
    } catch (error) {
      console.error("Failed to validate URLs:", error);
    } finally {
      setIsValidatingUrls(false);
    }
  };

  // Apply URL replacements
  const applyUrlReplacements = async () => {
    if (!urlValidation) return;

    const replacements = urlValidation.results
      .filter((r) => !r.valid && r.suggestedReplacement)
      .map((r) => ({
        oldUrl: r.url,
        newUrl: r.suggestedReplacement!.url,
        newTitle: r.suggestedReplacement!.title,
      }));

    if (replacements.length === 0) return;

    try {
      const res = await fetch("/api/admin/apply-url-replacements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editedContent,
          replacements,
        }),
      });

      const data = await res.json();

      if (res.ok && data.content) {
        setEditedContent(data.content);
        // Re-validate after applying replacements
        validateUrls(data.content);
      }
    } catch (error) {
      console.error("Failed to apply URL replacements:", error);
    }
  };

  // Helper to update frontmatter with image data
  const updateFrontmatterWithImage = (
    content: string,
    imagePath: string,
    creditName: string,
    creditUrl: string,
  ): string => {
    // Find the frontmatter section
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return content;

    let frontmatter = frontmatterMatch[1];

    // Remove existing image fields if present
    frontmatter = frontmatter
      .replace(/^image:.*$/m, "")
      .replace(/^imageCreditName:.*$/m, "")
      .replace(/^imageCreditUrl:.*$/m, "")
      .replace(/\n{3,}/g, "\n"); // Clean up extra newlines

    // Add new image fields before the closing ---
    const newImageFields = `image: "${imagePath}"\nimageCreditName: "${creditName}"\nimageCreditUrl: "${creditUrl}"`;

    // Trim frontmatter and add new fields
    frontmatter = frontmatter.trim() + "\n" + newImageFields;

    // Reconstruct the content
    const restOfContent = content.slice(frontmatterMatch[0].length);
    return `---\n${frontmatter}\n---${restOfContent}`;
  };

  // Simple markdown-to-HTML converter for preview
  const renderMarkdownPreview = (content: string) => {
    if (!content) return "";

    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, "");

    // Basic conversions for preview
    let html = withoutFrontmatter
      // H2
      .replace(
        /^## (.+)$/gm,
        "<h2 class='text-2xl font-semibold mt-8 mb-4'>$1</h2>",
      )
      // H3
      .replace(
        /^### (.+)$/gm,
        "<h3 class='text-xl font-semibold mt-6 mb-3'>$1</h3>",
      )
      // H6
      .replace(
        /^###### (.+)$/gm,
        "<h6 class='text-sm font-semibold mt-4 mb-2 text-muted-foreground'>$1</h6>",
      )
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-primary underline'>$1</a>",
      )
      // Bullet lists
      .replace(/^- (.+)$/gm, "<li class='ml-4'>$1</li>")
      // Horizontal rules
      .replace(/^---$/gm, "<hr class='my-6 border-border' />")
      // Paragraphs
      .split("\n\n")
      .map((p) => {
        if (
          p.startsWith("<h") ||
          p.startsWith("<hr") ||
          p.startsWith("<li") ||
          p.startsWith("<div")
        ) {
          return p;
        }
        return `<p class='mb-4'>${p}</p>`;
      })
      .join("\n");

    return html;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Generate Article
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter a topic to generate a complete MDX article
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Article Topic
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to Apply for Section 8 Housing Vouchers"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                rows={3}
                disabled={status === "generating"}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific about the government program or benefit you want to
                cover
              </p>
            </div>

            <button
              onClick={handleGenerateArticle}
              disabled={!topic.trim() || status === "generating"}
              className="w-full sm:w-auto bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "generating" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Article...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generate Article
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {status === "generating" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Generating your article...
                  </p>
                  <p className="text-sm text-blue-700">
                    This may take 30-60 seconds. Please don&apos;t close this
                    page.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "saving" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Saving article...</p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "success" && result && !result.error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-green-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-green-900">{result.message}</p>
                  <p className="text-sm text-green-700 mt-1">
                    Preview ready for:{" "}
                    <code className="bg-green-100 px-1 rounded">
                      {result.filePath}
                    </code>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "error" && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-red-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-red-900">
                    {result.error || "Failed to generate article"}
                  </p>
                  {result.slug && (
                    <p className="text-sm text-red-700 mt-1">
                      File already exists:{" "}
                      <code className="bg-red-100 px-1 rounded">
                        {result.slug}.mdx
                      </code>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Section */}
          {result?.content &&
            (status === "success" || status === "saving") &&
            !result.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                {/* Preview Toggle */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Article Preview
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMode("rendered")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        previewMode === "rendered"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Eye size={14} />
                      Rendered
                    </button>
                    <button
                      onClick={() => setPreviewMode("code")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        previewMode === "code"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Code size={14} />
                      Code
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    {previewMode === "code" ? (
                      <motion.div
                        key="code"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-muted p-4"
                      >
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full h-[600px] text-xs text-foreground bg-background rounded border border-border p-3 font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          spellCheck={false}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="rendered"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-background p-8 max-h-[600px] overflow-y-auto prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdownPreview(editedContent),
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Search Section */}
                <div className="border-t border-border pt-6 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ImageIcon className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Select Featured Image
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Search Pexels for a landscape image
                      </p>
                    </div>
                  </div>

                  {/* Selected/Processed Image Display */}
                  {selectedImage?.processed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={selectedImage.photo.url}
                          alt={selectedImage.photo.alt}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-green-900 flex items-center gap-2">
                            <Check size={16} />
                            Image added to frontmatter
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {selectedImage.imagePath}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Credit: {selectedImage.photo.photographer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Search Input */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={imageSearchQuery}
                        onChange={(e) => setImageSearchQuery(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleImageSearch()
                        }
                        placeholder="Search for images (e.g., family, healthcare, housing)"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        disabled={isSearchingImages}
                      />
                    </div>
                    <button
                      onClick={handleImageSearch}
                      disabled={!imageSearchQuery.trim() || isSearchingImages}
                      className="bg-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSearchingImages ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Search size={16} />
                      )}
                      Search
                    </button>
                  </div>

                  {/* Image Error */}
                  {imageError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                    >
                      {imageError}
                    </motion.div>
                  )}

                  {/* Image Results Grid */}
                  {imageSearchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    >
                      {imageSearchResults.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedImage({ photo })}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${
                            selectedImage?.photo.id === photo.id
                              ? "border-purple-500 ring-2 ring-purple-200"
                              : "border-transparent hover:border-purple-300"
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.alt}
                            className="w-full h-28 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-xs text-white truncate">
                              {photo.photographer}
                            </p>
                          </div>
                          {selectedImage?.photo.id === photo.id && (
                            <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Approve Image Button */}
                  {selectedImage && !selectedImage.processed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedImage.photo.url}
                          alt={selectedImage.photo.alt}
                          className="w-20 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-purple-900">
                            {selectedImage.photo.photographer}
                          </p>
                          <p className="text-xs text-purple-700">
                            Will be resized to 1200×800 JPG
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={handleApproveImage}
                          disabled={isProcessingImage}
                          className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                          {isProcessingImage ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              Approve Image
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* URL Validation Section */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">
                      Reference Link Validation
                    </h3>
                    <button
                      onClick={() => validateUrls()}
                      disabled={isValidatingUrls}
                      className="text-xs bg-blue-600 text-white py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {isValidatingUrls ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Search size={12} />
                          Check Links
                        </>
                      )}
                    </button>
                  </div>

                  {urlValidation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      {/* Summary */}
                      <div
                        className={`p-3 rounded-lg border ${
                          urlValidation.invalidUrls === 0
                            ? "bg-green-50 border-green-200"
                            : urlValidation.fixableUrls > 0
                              ? "bg-blue-50 border-blue-200"
                              : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            urlValidation.invalidUrls === 0
                              ? "text-green-900"
                              : urlValidation.fixableUrls > 0
                                ? "text-blue-900"
                                : "text-yellow-900"
                          }`}
                        >
                          {urlValidation.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            urlValidation.invalidUrls === 0
                              ? "text-green-700"
                              : urlValidation.fixableUrls > 0
                                ? "text-blue-700"
                                : "text-yellow-700"
                          }`}
                        >
                          {urlValidation.validUrls} valid
                          {urlValidation.invalidUrls > 0 &&
                            `, ${urlValidation.invalidUrls} broken`}
                          {urlValidation.fixableUrls > 0 &&
                            ` (${urlValidation.fixableUrls} replacement${urlValidation.fixableUrls > 1 ? "s" : ""} found)`}
                        </p>
                      </div>

                      {/* Replacement Suggestions */}
                      {urlValidation.fixableUrls > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">
                              Suggested Replacements
                            </p>
                            <button
                              onClick={applyUrlReplacements}
                              className="text-xs bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition-colors flex items-center gap-1.5"
                            >
                              <Check size={12} />
                              Apply All
                            </button>
                          </div>

                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {urlValidation.results
                              .filter((r) => !r.valid && r.suggestedReplacement)
                              .map((result, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-white border border-blue-200 rounded-lg text-xs space-y-2"
                                >
                                  {/* Original broken link */}
                                  <div className="pb-2 border-b border-gray-200">
                                    <p className="text-gray-500 font-medium mb-1">
                                      Original (broken):
                                    </p>
                                    <p className="text-gray-700">
                                      {result.linkContext}
                                    </p>
                                    <p className="text-gray-400 font-mono text-[10px] truncate">
                                      {result.url}
                                    </p>
                                  </div>

                                  {/* Suggested replacement */}
                                  <div>
                                    <p className="text-green-600 font-medium mb-1 flex items-center gap-1">
                                      <Check size={12} />
                                      Replacement (verified):
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                      {result.suggestedReplacement!.title}
                                    </p>
                                    <p className="text-blue-600 font-mono text-[10px] truncate mt-1">
                                      {result.suggestedReplacement!.url}
                                    </p>
                                    {result.suggestedReplacement!.snippet && (
                                      <p className="text-gray-600 mt-2 text-[11px] line-clamp-2">
                                        {result.suggestedReplacement!.snippet}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Unfixable broken links */}
                      {urlValidation.invalidUrls > 0 &&
                        urlValidation.results.some(
                          (r) => !r.valid && !r.suggestedReplacement,
                        ) && (
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            <p className="text-xs font-medium text-red-900 mb-2">
                              Unable to find replacements:
                            </p>
                            {urlValidation.results
                              .filter(
                                (r) => !r.valid && !r.suggestedReplacement,
                              )
                              .map((result, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 bg-red-50 border border-red-200 rounded text-xs"
                                >
                                  <div className="flex items-start gap-2">
                                    <AlertCircle
                                      size={14}
                                      className="text-red-600 mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-red-900">
                                        {result.linkContext}
                                      </p>
                                      <p className="text-red-700 font-mono text-[10px] break-all mt-1">
                                        {result.url}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                    </motion.div>
                  )}

                  {!urlValidation && !isValidatingUrls && (
                    <p className="text-xs text-muted-foreground">
                      Click "Check Links" to verify all reference URLs are valid
                      and accessible.
                    </p>
                  )}
                </div>

                {/* Approve Article Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <button
                    onClick={handleApprove}
                    disabled={status === "saving"}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {status === "saving" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Approve & Save Article
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
        </motion.div>

        {/* Quick Stats / Info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Articles Generated</p>
            <p className="text-2xl font-semibold text-foreground mt-1">—</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Model</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              GPT-4o
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Output</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              content/posts/
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

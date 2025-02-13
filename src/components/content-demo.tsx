"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function ContentDemo() {
  const [topic, setTopic] = React.useState("")
  const [contentType, setContentType] = React.useState("blog-post")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState("")

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please enter a topic")
      return
    }

    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const demoContent = {
        "blog-post": `# ${topic}\n\nAre you ready to revolutionize your approach to ${topic}? In this comprehensive guide, we'll explore the latest trends, best practices, and innovative strategies that are reshaping the landscape of ${topic} in 2025.\n\n## Why ${topic} Matters\n\nIn today's rapidly evolving digital landscape, ${topic} has become more crucial than ever. Organizations that effectively leverage ${topic} are seeing unprecedented growth and engagement...`,
        "social-post": `🚀 Exciting news! We're diving deep into ${topic} today!\n\n🔑 Key takeaways:\n- Innovation in ${topic}\n- Best practices for success\n- Future trends to watch\n\n💡 Want to learn more? Click the link in our bio!\n\n#${topic.replace(/\s+/g, '')} #Innovation #Growth #Success`,
        "email": `Subject: Transform Your Business with ${topic}\n\nDear [Name],\n\nI hope this email finds you well. I wanted to share some exciting insights about ${topic} that could revolutionize your approach to business growth.\n\nBest regards,\n[Your Name]`
      }[contentType]

      setGeneratedContent(demoContent)
      setIsGenerating(false)
      toast.success("Content generated successfully!")
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast.success("Copied to clipboard!")
  }

  return (
    <section className="py-20 sm:py-32">
      <motion.div
        className="container-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={item}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Try It Yourself
          </h2>
          <p className="text-muted-foreground">
            Experience the power of AI-generated content. Enter a topic and watch
            the magic happen.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-3xl"
          variants={item}
        >
          <Card>
            <CardHeader>
              <CardTitle>Content Generator</CardTitle>
              <CardDescription>
                Generate high-quality content in seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-3">
                  <Input
                    placeholder="Enter your topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Select
                    value={contentType}
                    onValueChange={setContentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog-post">Blog Post</SelectItem>
                      <SelectItem value="social-post">Social Post</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>

              {generatedContent && (
                <div className="relative mt-4">
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}

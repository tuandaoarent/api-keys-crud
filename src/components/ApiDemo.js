"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Copy, Check } from "lucide-react"

export function ApiDemo() {
  const [githubUrl, setGithubUrl] = useState("https://github.com/langchain-ai/langchain")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [copied, setCopied] = useState(false)

  const exampleResponse = {
    isValid: true,
    githubUrl: "https://github.com/langchain-ai/langchain",
    readmeData: {
      content: `# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

LangChain is a framework for developing applications powered by language models. The platform for building reliable agents.

## Quick Install

\`\`\`bash
pip install langchain
\`\`\``,
    },
    stars: 94523,
    forks: 15234,
    watchers: 1823,
    openIssues: 342,
    language: "Python",
    createdAt: "2022-10-17T02:58:36Z",
    updatedAt: "2025-01-07T14:23:45Z",
    description: "🦜🔗 Build context-aware reasoning applications",
    topics: ["llm", "ai", "langchain", "gpt", "nlp", "machine-learning"],
    license: "MIT",
    coolFacts: [
      "This repository has been starred over 94,000 times!",
      "The project has 500+ contributors from around the world",
      "Average response time to issues: 2.3 hours",
    ],
    latestRelease: {
      version: "v0.1.0",
      publishedAt: "2025-01-05T10:30:00Z",
      name: "LangChain v0.1.0 Release",
    },
    recentPullRequests: [
      {
        title: "Add support for new OpenAI models",
        number: 15234,
        state: "open",
        createdAt: "2025-01-06T08:15:00Z",
      },
      {
        title: "Fix memory leak in conversation chain",
        number: 15198,
        state: "merged",
        createdAt: "2025-01-05T14:22:00Z",
      },
    ],
  }

  const handleDemo = async () => {
    setIsLoading(true)
    setResponse(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setResponse(exampleResponse)
    setIsLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(exampleResponse, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="container mx-auto px-4 py-24 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 font-mono text-xs">
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Try it yourself.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            See how Pepperwood analyzes GitHub repositories in real-time. Enter any public repository URL below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-mono">Request</CardTitle>
              <CardDescription>POST /api/github-summarizer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">GitHub Repository URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://github.com/owner/repo"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Request Body</label>
                <pre className="bg-background border border-border rounded-md p-3 text-xs font-mono overflow-x-auto">
                  {JSON.stringify({ githubUrl }, null, 2)}
                </pre>
              </div>

              <Button onClick={handleDemo} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Demo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Response Panel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">Response</CardTitle>
                  {response && (
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs font-mono bg-green-500/10 text-green-500">
                        200 OK
                      </Badge>
                      <span className="text-xs">5.49s</span>
                    </CardDescription>
                  )}
                </div>
                {response && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!response && !isLoading && (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Click &quot;Run Demo&quot; to see the response
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              )}

              {response && (
                <div className="bg-background border border-border rounded-md p-3 max-h-96 overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Key Insights Display */}
        {response && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Stars</CardTitle>
                <div className="text-2xl font-bold">{response.stars.toLocaleString()}</div>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Language</CardTitle>
                <div className="text-2xl font-bold">{response.language}</div>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
                <div className="text-2xl font-bold">{response.openIssues}</div>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}

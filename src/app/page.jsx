import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Star, TrendingUp, GitPullRequest, Package, Sparkles } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import LoginButton from "../components/LoginButton"
import DebugAuth from "../components/DebugAuth"
import { ApiDemo } from "../components/ApiDemo"
import { ScrollButton } from "../components/ScrollButton"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center relative">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            <span className="text-lg sm:text-xl font-semibold font-mono">Pepperwood</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {session ? (
              <>
                <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">
                  Welcome, {session.user.name}
                </span>
                <Link href="/dashboards">
                  <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dash</span>
                  </Button>
                </Link>
                <LoginButton />
              </>
            ) : (
              <>
                <LoginButton />
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 font-mono text-xs bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            AI-Powered Repository Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            Deep insights for your GitHub repositories.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Get comprehensive summaries, track stars, discover cool facts, monitor important pull requests, and stay
            updated with version changes—all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {session ? (
              <Link href="/dashboards">
                <Button size="lg" className="text-base px-6 sm:px-8 w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <LoginButton size="lg" className="w-full sm:w-auto" />
                <ScrollButton 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                  targetId="api-demo"
                >
                  View Demo
                </ScrollButton>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Repositories Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">99.9%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything you need to understand your repositories.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful analytics and insights to help you make better decisions about your open source projects.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Smart Summaries</CardTitle>
              <CardDescription>
                AI-generated summaries that capture the essence of any repository in seconds.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Star Tracking</CardTitle>
              <CardDescription>
                Monitor star growth over time with beautiful visualizations and trend analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Cool Facts</CardTitle>
              <CardDescription>
                Discover interesting statistics and unique insights about repository activity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <GitPullRequest className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>PR Highlights</CardTitle>
              <CardDescription>Stay informed about the most important pull requests and code changes.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Version Updates</CardTitle>
              <CardDescription>
                Track releases and version changes with detailed changelogs and impact analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Real-time Sync</CardTitle>
              <CardDescription>
                Automatic synchronization with GitHub ensures you always have the latest data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* API Demo Section */}
      <div id="api-demo">
        <ApiDemo />
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Simple, transparent pricing.</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="bg-card border-border flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out Pepperwood</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Up to 5 repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Basic summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Star tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Weekly updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboards" className="w-full">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-card border-border flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious developers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Up to 50 repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>AI-powered summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>PR highlights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Real-time updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-background text-foreground hover:bg-background/90 cursor-not-allowed opacity-60" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="bg-card border-border flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For teams and organizations</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Unlimited repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Advanced security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>SLA guarantee</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent cursor-not-allowed opacity-60" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-accent via-accent/90 to-accent/70 text-accent-foreground rounded-2xl p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to analyze your repositories?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-accent-foreground/90 text-pretty">
            Join hundreds of developers who trust Pepperwood for their GitHub analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {session ? (
              <Link href="/dashboards">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-6 sm:px-8 w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <LoginButton size="lg" className="w-full sm:w-auto" />
                <ScrollButton
                  size="lg"
                  variant="outline"
                  className="border-accent-foreground/20 hover:bg-accent-foreground/10 px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                  targetId="api-demo"
                >
                  Schedule Demo
                </ScrollButton>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="h-5 w-5 text-accent" />
                <span className="font-semibold font-mono">Pepperwood</span>
              </div>
              <p className="text-sm text-muted-foreground">Deep insights for your GitHub repositories.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Pepperwood. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <DebugAuth />
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-6">Explore</h1>
      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Construction className="h-6 w-6 text-muted-foreground" />
          </span>
          <h2 className="text-xl font-semibold text-foreground">Coming soon</h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Match-level head-to-head predictions aren&apos;t modelled yet — this project only
            predicts final league position, not individual results.
          </p>
          <Button
            render={<Link href="/predictions" />}
            variant="outline"
            className="min-h-11 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to predictions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

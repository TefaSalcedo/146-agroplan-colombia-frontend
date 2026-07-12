import Link from "next/link"
import { ArrowRight, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DashboardActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  tone?: "primary" | "accent"
  linkLabel?: string
}

export function DashboardActionCard({
  icon: Icon,
  title,
  description,
  href,
  tone = "primary",
  linkLabel = "Ver todos",
}: DashboardActionCardProps) {
  const toneClasses =
    tone === "accent"
      ? "bg-accent text-accent-foreground"
      : "bg-primary/10 text-primary"

  return (
    <Link href={href} className="group block h-full focus:outline-none">
      <Card className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring active:scale-95">
        <div className={`flex size-12 items-center justify-center rounded-2xl ${toneClasses}`}>
          <Icon className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold leading-tight">{title}</p>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
          <span>{linkLabel}</span>
          <ArrowRight className="size-4" />
        </div>
      </Card>
    </Link>
  )
}

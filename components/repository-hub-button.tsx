"use client"

import { usePathname } from "next/navigation"
const repositoryUrl = "https://github.com/TefaSalcedo/146-agroplan-colombia-ml"

type RepositoryHubButtonProps = {
  placement?: "landing" | "inline"
}

export function RepositoryHubButton({ placement = "landing" }: RepositoryHubButtonProps) {
  const pathname = usePathname()
  const isLanding = placement === "landing" && pathname === "/"

  if (placement === "landing" && !isLanding) return null

  const buttonClassName = isLanding
    ? "repository-hub-button flex h-9 w-9 items-center justify-center gap-2 rounded-xl border border-orange-200/90 bg-orange-500 px-0 text-xs font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_0_28px_rgba(249,115,22,0.7)] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 sm:h-10 sm:w-auto sm:justify-start sm:px-4 sm:text-sm"
    : "repository-hub-button inline-flex size-9 items-center justify-center rounded-xl border border-orange-200/90 bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_0_28px_rgba(249,115,22,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"

  return (
    <div className="group/repository relative inline-flex">
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer"
        className={buttonClassName}
        aria-describedby={isLanding ? "main-repository-tooltip" : undefined}
        aria-label="Ver repositorio GitHub"
        title={isLanding ? undefined : "Ver repositorio GitHub"}
      >
        <svg
          viewBox="0 0 24 24"
          className={isLanding ? "size-4 sm:size-5" : "size-4"}
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.73.084-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.21 0 1.595-.015 2.88-.015 3.27 0 .315.21.69.825.57C20.565 22.092 24 17.595 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        {isLanding && <span className="hidden sm:inline">Ver repositorio principal</span>}
      </a>
      {isLanding && (
        <span
          id="main-repository-tooltip"
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full mt-3 hidden w-max max-w-56 -translate-x-1/4 rounded-xl border border-white/20 bg-black/85 px-3 py-2 text-xs font-medium leading-relaxed text-white opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-200 group-hover/repository:opacity-100 group-focus-within/repository:opacity-100 sm:block"
        >
          Ver repositorio GitHub
        </span>
      )}
    </div>
  )
}

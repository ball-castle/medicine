import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrototypeShell(props: HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <section className={cn("grid gap-6 xl:grid-cols-[0.92fr_1.08fr]", className)} {...rest} />;
}

export function PrototypeSidebar(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "space-y-6 rounded-[28px] border border-border/70 bg-card/82 p-6 shadow-soft backdrop-blur md:p-7",
        className,
      )}
      {...rest}
    />
  );
}

export function PrototypeStage(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("space-y-4", className)} {...rest} />;
}

export function PrototypeEyebrow(props: HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props;
  return (
    <p
      className={cn("font-display text-xs uppercase tracking-[0.24em] text-primary", className)}
      {...rest}
    />
  );
}

export function PrototypeIntro(props: { eyebrow?: string; title: string; description: ReactNode }) {
  return (
    <div className="space-y-4">
      <PrototypeEyebrow>{props.eyebrow ?? "Prototype"}</PrototypeEyebrow>
      <h2 className="font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.04] tracking-[-0.04em] text-foreground">
        {props.title}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground md:text-base">{props.description}</p>
    </div>
  );
}

export function PrototypeControlGroup(props: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-3 border-t border-dashed border-border/70 pt-4 first:border-t-0 first:pt-0", props.className)}>
      {props.title ? (
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.title}</p>
      ) : null}
      {props.children}
    </div>
  );
}

export function PrototypeSelectableButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; tone?: "primary" | "accent" | "neutral" },
) {
  const { active = false, tone = "primary", className, type = "button", ...rest } = props;
  const activeClassName =
    tone === "accent"
      ? "border-accent/40 bg-accent/10 shadow-soft"
      : tone === "neutral"
        ? "border-foreground/15 bg-foreground/5 shadow-soft"
        : "border-primary/40 bg-primary/10 shadow-soft";

  return (
    <button
      className={cn(
        "w-full rounded-[20px] border border-border/70 bg-background/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-background",
        active ? activeClassName : "",
        className,
      )}
      type={type}
      {...rest}
    />
  );
}

export function PrototypeNoteCard(props: { label: string; title: ReactNode; description: ReactNode; className?: string }) {
  return (
    <article className={cn("rounded-[20px] border border-border/70 bg-background/60 p-4", props.className)}>
      <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.label}</p>
      <strong className="mt-2 block font-display text-lg leading-6 text-foreground">{props.title}</strong>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{props.description}</p>
    </article>
  );
}

export function PrototypeReadoutCard(props: { label: string; title: ReactNode; description: ReactNode; className?: string }) {
  return (
    <article className={cn("rounded-[20px] border border-border/70 bg-card/82 p-4", props.className)}>
      <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">{props.label}</p>
      <strong className="mt-2 block font-display text-lg leading-6 text-foreground">{props.title}</strong>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{props.description}</p>
    </article>
  );
}

export function PrototypeVisualCard(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,249,241,0.88))] p-4 shadow-soft backdrop-blur",
        className,
      )}
      {...rest}
    />
  );
}

export function PrototypeLinkRow(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("flex flex-wrap gap-3", className)} {...rest} />;
}

export function PrototypeLinkButton(props: {
  href: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <Button
      asChild
      className={cn(props.variant !== "default" && "bg-background/60 hover:bg-background", props.className)}
      variant={props.variant ?? "outline"}
    >
      <Link href={props.href}>{props.children}</Link>
    </Button>
  );
}

export const prototypeRangeClassName =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-border/60 accent-primary";

export const prototypeSliderTopClassName = "flex items-center justify-between gap-3";
export const prototypeSliderValueClassName = "font-display text-2xl leading-none text-foreground";
export const prototypeSliderLegendClassName = "flex items-center justify-between gap-3 text-xs text-muted-foreground";
export const prototypeCardGridClassName = "grid gap-3";
export const prototypeReadoutGridClassName = "grid gap-3 md:grid-cols-3";
export const prototypeSvgClassName = "h-auto w-full";

export const prototypeSvgStyles: Record<string, CSSProperties> = {
  label: {
    fill: "rgba(29,45,42,0.92)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
  },
  display: {
    fill: "rgba(23,51,48,0.94)",
    fontFamily: "var(--font-display)",
    fontSize: 18,
    letterSpacing: "0.04em",
  },
  subtext: {
    fill: "rgba(23,51,48,0.72)",
    fontFamily: "var(--font-display)",
    fontSize: 14,
  },
  panelTitle: {
    fill: "rgba(23,51,48,0.94)",
    fontFamily: "var(--font-display)",
    fontSize: 17,
  },
  panelCopy: {
    fill: "rgba(78,96,90,0.92)",
    fontFamily: "var(--font-body)",
    fontSize: 13,
  },
  callout: {
    fill: "rgba(23,51,48,0.92)",
    fontFamily: "var(--font-display)",
    fontSize: 13,
  },
};

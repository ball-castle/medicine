import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ActionLink = {
  href: string;
  label: string;
  variant?: "default" | "outline" | "ghost";
};

type StatItem = {
  value: string;
  label: string;
};

type TextSection = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export function PrototypePageLayout(props: {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  actions: ActionLink[];
  stats: StatItem[];
  children: ReactNode;
  validateSection?: TextSection;
  nextSection?: TextSection;
}) {
  return (
    <main className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-6 py-8 md:py-10">
      <section className="grid gap-6 rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,240,0.9),rgba(241,233,220,0.74))] p-6 shadow-soft backdrop-blur md:p-8 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1" variant="accent">
              {props.eyebrow}
            </Badge>
            <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-foreground md:text-6xl">
              {props.title}
            </h1>
            <p className="text-lg leading-8 text-foreground/86">{props.subtitle}</p>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{props.intro}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {props.actions.map((action, index) => (
              <Button asChild key={`${action.href}:${action.label}`} size="lg" variant={action.variant ?? (index === 0 ? "default" : "outline")}>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {props.stats.map((stat) => (
            <Card className="border-border/70 bg-card/78" key={`${stat.value}:${stat.label}`}>
              <CardHeader className="space-y-2">
                <CardTitle className="text-4xl">{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {props.children}

      {props.validateSection || props.nextSection ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {props.validateSection ? (
            <Card className="border-border/70 bg-card/82">
              <CardHeader className="space-y-4">
                <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                  {props.validateSection.eyebrow}
                </Badge>
                <div className="space-y-3">
                  <CardTitle className="text-3xl md:text-4xl">{props.validateSection.title}</CardTitle>
                  <CardDescription className="text-base">{props.validateSection.description}</CardDescription>
                </div>
              </CardHeader>
              <div className="grid gap-4 px-6 pb-6">
                {props.validateSection.items.map((item) => (
                  <Card className="border-border/70 bg-background/60 shadow-none" key={item}>
                    <CardContent className="p-5 text-sm leading-7 text-foreground/85">{item}</CardContent>
                  </Card>
                ))}
              </div>
            </Card>
          ) : null}

          {props.nextSection ? (
            <Card className="border-border/70 bg-card/82">
              <CardHeader className="space-y-4">
                <Badge className="w-fit rounded-full px-3 py-1" variant="outline">
                  {props.nextSection.eyebrow}
                </Badge>
                <div className="space-y-3">
                  <CardTitle className="text-3xl md:text-4xl">{props.nextSection.title}</CardTitle>
                  <CardDescription className="text-base">{props.nextSection.description}</CardDescription>
                </div>
              </CardHeader>
              <div className="grid gap-4 px-6 pb-6">
                {props.nextSection.items.map((item) => (
                  <Card className="border-border/70 bg-background/60 shadow-none" key={item}>
                    <CardContent className="p-5 text-sm leading-7 text-foreground/85">{item}</CardContent>
                  </Card>
                ))}
              </div>
            </Card>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

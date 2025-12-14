"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Our <span className="text-primary">Mission</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-3xl mx-auto">
          At Acme, our mission is to empower teams to build modern web products
          faster, with confidence and joy. We focus on simplicity, performance,
          and thoughtful design.
        </motion.p>
      </section>

      {/* Mission pillars */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Card className="rounded-2xl h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground">{p.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            How We Work
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {principles.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl bg-background p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <p className="text-muted-foreground">{p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Join Our Mission</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you are a developer, designer, or product leader — Acme helps
          you build better software, together.
        </p>
        <Button size="lg" className="rounded-2xl">
          <Link href="/">Get Started</Link>
        </Button>
      </section>
    </div>
  );
}

const pillars = [
  {
    title: "Empower Teams",
    description:
      "We remove friction so teams can focus on solving real problems, not fighting tools.",
    icon: "🚀",
  },
  {
    title: "Build with Care",
    description:
      "We value quality, accessibility, and long-term maintainability in everything we ship.",
    icon: "🧠",
  },
  {
    title: "Move Fast",
    description:
      "Speed matters. We help teams iterate quickly without sacrificing stability.",
    icon: "⚡",
  },
];

const principles = [
  "Start with the user and work backwards.",
  "Design should feel effortless and intuitive.",
  "Performance is a feature, not an afterthought.",
  "Small improvements compound over time.",
  "Great products are built by aligned teams.",
];

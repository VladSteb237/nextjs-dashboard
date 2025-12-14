"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              About <span className="text-primary">Acme</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Acme is a modern Next.js application focused on speed, clarity,
              and delightful user experience. We build tools that help teams
              move faster and ship with confidence.
            </p>
            <Button size="lg" className="rounded-2xl">
              <Link href="/dashboard/about/mission">Our Mission</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative">
            <Image
              src="/about-hero.png"
              alt="Acme App Interface"
              width={720}
              height={480}
              className="rounded-2xl shadow-xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <Card
              key={v.title}
              className="rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  {v.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{v.title}</h3>
                <p className="text-muted-foreground">{v.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <Card
                key={m.name}
                className="rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={m.image}
                  alt={m.name}
                  width={400}
                  height={400}
                  className="object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Build with Acme</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of developers using Acme to create fast, reliable, and
          beautiful web applications.
        </p>
        <Button size="lg" variant="default" className="rounded-2xl">
          <Link href="/">Get Started</Link>
        </Button>
      </section>
    </div>
  );
}

const values = [
  {
    title: "Performance",
    description: "Optimized for speed with modern Next.js architecture.",
    icon: <span className="text-primary text-xl">⚡</span>,
  },
  {
    title: "Design",
    description: "Clean, elegant UI that feels great to use.",
    icon: <span className="text-primary text-xl">🎨</span>,
  },
  {
    title: "Reliability",
    description: "Built with best practices and scalable patterns.",
    icon: <span className="text-primary text-xl">🛡️</span>,
  },
];

const team = [
  {
    name: "Alex Johnson",
    role: "Product Lead",
    image: "/team/team-1.png",
  },
  {
    name: "Maria Lee",
    role: "Design Director",
    image: "/team/teams-3.png",
  },
  {
    name: "Daniel Smith",
    role: "Frontend Engineer",
    image: "/team/teams-2.png",
  },
  {
    name: "Sophia Brown",
    role: "Backend Engineer",
    image: "/team/team-4.png",
  },
];

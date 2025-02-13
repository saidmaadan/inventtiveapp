"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-background">
      
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="absolute h-full w-full">
          <div className="absolute right-0 top-0 h-[300px] w-[300px] bg-purple-500/30 blur-[100px]" />
          <div className="absolute left-0 top-0 h-[300px] w-[300px] bg-cyan-500/30 blur-[100px]" />
        </div>
      <motion.div
        className="container-center relative"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={item}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            variants={item}
          >
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-muted">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Content Creation
            </span>
          </motion.div>
          <motion.h1
            className="font-heading text-4xl font-bold tracking-tight sm:text-6xl"
            variants={item}
          >
            Transform Your Ideas into
            <span className="text-gradient bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Compelling Content
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            variants={item}
          >
            Harness the power of AI to create high-quality, engaging content in
            seconds. From blog posts to social media, we&apos;ve got you covered.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={item}
          >
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 flow-root sm:mt-24"
          variants={item}
        >
          <div className="relative rounded-xl bg-card p-2">
            <div className="relative rounded-lg bg-muted p-8">
              <div className="absolute -inset-px animate-pulse rounded-lg bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-purple-500/50 opacity-20" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="h-4 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-4 w-2/4 rounded bg-muted-foreground/20" />
                <div className="h-4 w-1/4 rounded bg-muted-foreground/20" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  
    </section>
  )
}

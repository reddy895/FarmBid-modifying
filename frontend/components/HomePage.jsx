'use client'

import { useState, useEffect, useRef } from 'react'
import { animate as anime } from 'animejs'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Leaf, Shield, Zap, TrendingUp, Users, Award, Globe,
  ArrowRight, Play, Star, CheckCircle, Sparkles,
  BarChart3, Lock, Timer, IndianRupee, Headphones
} from 'lucide-react'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    // Preloader animation
    setTimeout(() => {
      anime({
        targets: '.preloader-circle',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutBack'
      })
      anime({
        targets: '.preloader-text',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: 200,
        duration: 800
      })
    }, 100)

    // Hero entrance animation
    setTimeout(() => {
      const heroTimeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200
      })

      heroTimeline
        .add({
          targets: '.hero-title .word',
          translateY: [100, 0],
          opacity: [0, 1],
          rotateX: [-90, 0],
          delay: anime.stagger(100)
        })
        .add({
          targets: '.hero-subtitle',
          translateY: [30, 0],
          opacity: [0, 1],
          scale: [0.9, 1]
        }, '-=800')
        .add({
          targets: '.hero-buttons .btn-animate',
          translateX: [-50, 0],
          opacity: [0, 1],
          delay: anime.stagger(150)
        }, '-=600')
        .add({
          targets: '.hero-decoration',
          scale: [0, 1],
          opacity: [0, 0.1],
          delay: anime.stagger(100)
        }, '-=400')
    }, 2000)

    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.stat-number',
            innerHTML: [0, function(el) {
              const value = parseInt(el.dataset.value)
              return el.dataset.float ? value.toFixed(1) : value
            }],
            round: 1,
            easing: 'easeOutQuart',
            duration: 2500,
            delay: anime.stagger(200)
          })
        }
      })
    }, { threshold: 0.5 })

    if (statsRef.current) statsObserver.observe(statsRef.current)

    // Feature cards 3D flip animation
    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.feature-card',
            translateY: [80, 0],
            translateZ: 0,
            rotateX: [-15, 0],
            opacity: [0, 1],
            delay: anime.stagger(150, { from: 'last' }),
            easing: 'spring(1, 80, 10, 0)',
            duration: 1200
          })
        }
      })
    }, { threshold: 0.1 })

    if (featuresRef.current) featuresObserver.observe(featuresRef.current)

    // Testimonials staggered slide animation
    const testimonialsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.testimonial-card',
            translateX: (el, i) => i % 2 === 0 ? [-150, 0] : [150, 0],
            opacity: [0, 1],
            delay: anime.stagger(250),
            easing: 'easeOutExpo',
            duration: 1000
          })
        }
      })
    }, { threshold: 0.2 })

    if (testimonialsRef.current) testimonialsObserver.observe(testimonialsRef.current)

    // CTA pulse animation
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.cta-pulse',
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 rgba(255,255,255,0)',
              '0 0 60px rgba(255,255,255,0.5)',
              '0 0 30px rgba(255,255,255,0.2)'
            ],
            duration: 2000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
          })
        }
      })
    }, { threshold: 0.5 })

    if (ctaRef.current) ctaObserver.observe(ctaRef.current)

    // Continuous floating animation for decorative elements
    anime({
      targets: '.floating-element',
      translateY: [-20, 20],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 4000,
      delay: anime.stagger(600)
    })

    // Particle float animation
    anime({
      targets: '.particle',
      translateY: [-30, -60],
      translateX: (el) => el.dataset.direction === 'left' ? [-10, 10] : [10, -10],
      opacity: [0, 1, 0],
      duration: 6000,
      loop: true,
      delay: anime.stagger(300),
      easing: 'easeInOutQuad'
    })

  }, [])

  const stats = [
    { label: 'Active Farmers', value: 2847, icon: Users, color: 'from-blue-500 to-cyan-500', suffix: '+', isFloat: false },
    { label: 'Transactions', value: 42.5, icon: IndianRupee, color: 'from-green-500 to-emerald-500', suffix: 'L+', isFloat: true },
    { label: 'Quality Score', value: 94, icon: Award, color: 'from-purple-500 to-pink-500', suffix: '%', isFloat: false },
    { label: 'Secure', value: 100, icon: Shield, color: 'from-orange-500 to-amber-500', suffix: '%', isFloat: false }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Secured',
      description: 'Every transaction is immutably recorded on Polygon blockchain. Complete transparency with cryptographic proof of every trade.',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-900/50 to-cyan-900/50',
      accentColor: 'border-blue-500/30'
    },
    {
      icon: Zap,
      title: 'Real-time Auctions',
      description: 'Millisecond live bidding with WebSocket updates. Farmers set floor prices, buyers compete in real-time creating fair market value.',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-900/50 to-emerald-900/50',
      accentColor: 'border-green-500/30'
    },
    {
      icon: Sparkles,
      title: 'AI Quality Analysis',
      description: 'Computer vision AI analyzes produce photos using neural networks. Generates objective quality scores and standardized grades.',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-900/50 to-pink-900/50',
      accentColor: 'border-purple-500/30'
    },
    {
      icon: Globe,
      title: 'Direct Connection',
      description: 'Complete disintermediation. Direct farmer-to-buyer marketplace with smart contracts automating the entire escrow and settlement.',
      color: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-900/50 to-amber-900/50',
      accentColor: 'border-orange-500/30'
    },
    {
      icon: Lock,
      title: 'Smart Escrow',
      description: 'Automatic escrow via Ethereum smart contracts. Funds secured until delivery confirmed with IoT sensors and digital signatures.',
      color: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-900/50 to-rose-900/50',
      accentColor: 'border-red-500/30'
    },
    {
      icon: Timer,
      title: '24/7 Marketplace',
      description: 'Always open for business. Farmers list anytime, auctions run continuously with fair time-limited windows and auto-extension rules.',
      color: 'from-indigo-500 to-violet-500',
      bgGradient: 'from-indigo-900/50 to-violet-900/50',
      accentColor: 'border-indigo-500/30'
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Tomato Farmer, Kolar',
      content: 'FarmBid disrupted the entire mandi system. Got 40% better prices and payments clear in hours, not weeks. The blockchain receipt even helped me get a bank loan.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Priya Sharma',
      role: 'Buyer, Bengaluru',
      content: 'Quality scores backed by AI + blockchain provenance means my customers trust my produce more. Traceability from farm to fork is now a competitive advantage.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Anand Reddy',
      role: 'Chili Farmer, Ramanagara',
      content: 'The WhatsApp bot is pure genius - no smartphones needed. My son set it up once and now I get auction alerts and can accept bids on my feature phone.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 text-white overflow-x-hidden relative">
      {/* Preloader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <div className="text-center">
              <motion.div className="preloader-circle w-24 h-24 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full mx-auto" />
              <motion.p className="preloader-text text-emerald-400 font-mono text-2xl tracking-[0.3em] mt-6">
                FARMbid
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: '5%', top: '10%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ right: '10%', top: '30%' }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: '40%', bottom: '10%' }}
        />

        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            className="particle absolute w-1.5 h-1.5 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--direction': Math.random() > 0.5 ? 'left' : 'right'
            }}
            animate={{
              translateY: [-50, -100],
              translateX: (el) => el.style.getPropertyValue('--direction') === 'left' ? [-20, 20] : [20, -20],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 6000 + Math.random() * 4000,
              repeat: Infinity,
              delay: Math.random() * 3000
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-slate-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-60" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              FarmBid
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Features</a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Impact</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Stories</a>
            <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 font-medium">
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 z-20"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mb-12 inline-block"
          >
            <Badge className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/40 text-emerald-300 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              🔗 Powered by Polygon Blockchain
            </Badge>
          </motion.div>

          {/* Animated Title */}
          <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
            {['Farmers', 'Set', 'the', 'Price.', 'Buyers', 'Compete', 'Upward.'].map((word, i) => (
              <motion.span
                key={i}
                className="hero-word word inline-block mr-4 mb-2"
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 1.8 + i * 0.12,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 8px 24px rgba(16, 185, 129, 0.4))'
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 3.2 }}
            className="hero-subtitle text-2xl md:text-4xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed font-light"
          >
            The world's first agricultural marketplace where{' '}
            <span className="font-bold text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text">
              AI quality assessment meets smart contract escrow
            </span>{' '}
            for truly transparent trade.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.8 }}
            className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.94 }}
              className="btn-animate"
            >
              <Button
                size="lg"
                className="px-12 py-7 text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 shadow-2xl hover:shadow-emerald-500/60 border-0 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Play className="w-7 h-7 mr-3 relative z-10" fill="currentColor" />
                <span className="relative z-10">Start Trading Now</span>
                <ArrowRight className="w-7 h-7 ml-3 relative z-10" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.94 }}
              className="btn-animate"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-12 py-7 text-lg font-semibold border-2 border-white/40 text-white hover:bg-white hover:text-slate-950 backdrop-blur-md transition-all duration-300 group"
              >
                <BarChart3 className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform" />
                <span>Watch Demo</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating decorative elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`decor-${i}`}
              className="hero-decoration floating-element absolute opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 4 + i * 0.3, duration: 1, type: "spring" }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 60}%`
              }}
            >
              <Leaf className="w-32 h-32 text-emerald-500/30" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-32 px-4 relative z-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/40 text-cyan-300 backdrop-blur-xl">
              📊 Real-Time Platform Metrics
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Trusted Across Karnataka
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Real numbers from real farmers making real money. Every transaction is a success story.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 100, scale: 0.7 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 1,
                  type: "spring",
                  stiffness: 80
                }}
                className="group"
              >
                <Card className="h-full border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl hover:from-white/10 hover:to-white/5 hover:border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                  {/* Animated gradient glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${stat.color.split(' ')[0].replace('from-', '')}/30 0%, transparent 50%, ${stat.color.split(' ')[2]?.replace('to-', '') || 'rgba(0,0,0,0)'}/30 100%)`,
                      filter: 'blur(40px)'
                    }}
                  />

                  <CardContent className="pt-10 pb-10 relative z-10">
                    {/* Animated icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color}/20 mb-6 border border-white/10 relative overflow-hidden`}
                      whileHover={{ rotate: [0, -15, 15, 0] }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                      <stat.icon className="w-10 h-10 text-white relative z-10" />
                    </motion.div>

                    {/* Animated counter */}
                    <div className="stat-number text-5xl font-black mb-3 text-white tracking-tight" data-value={stat.value} data-float={stat.isFloat}>
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        0{stat.isFloat ? '.0' : ''}
                      </motion.span>
                    </div>

                    {/* Label with animation */}
                    <motion.div
                      className="text-gray-400 font-semibold uppercase tracking-wider text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      {stat.label}
                    </motion.div>

                    {/* Bottom glow */}
                    <motion.div
                      className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br ${stat.color}/20 blur-3xl`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 0.6, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-32 px-4 relative z-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"
      >
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-rose-900/50 border border-purple-500/40 text-purple-300 backdrop-blur-xl">
              ✨ Revolutionary Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Built for Modern Agriculture
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Cutting-edge technology ensuring transparency, efficiency, and fairness in every transaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 120, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.1,
                  duration: 1,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="feature-card perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <Card
                  className={`
                    h-full border ${feature.accentColor} bg-gradient-to-br ${feature.bgGradient}
                    backdrop-blur-2xl hover:shadow-2xl hover:shadow-[var(--tw-gradient-from)]/20
                    transition-all duration-500 group overflow-hidden relative
                  `}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    animate={{
                      background: [
                        'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)'
                      ]
                    }}
                  />

                  <CardHeader className="relative z-20">
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color}/20 mb-6 border border-white/10 relative overflow-hidden`}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <feature.icon className={`w-8 h-8 text-transparent bg-gradient-to-br ${feature.color} bg-clip-text`} />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:translate-x-3 transition-transform duration-500">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-20">
                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Decorative element */}
                  <motion.div
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-white/40" />
                  </motion.div>

                  {/* Corner glow */}
                  <div className={`absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-br ${feature.color}/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="py-32 px-4 relative z-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-slate-950 to-rose-950/20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/40 text-amber-300 backdrop-blur-xl">
              ⭐ Real Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Voices from the Field
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Real farmers, real buyers, real transformations. These are their stories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -150 : 150 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.2, duration: 1, ease: "easeOutExpo" }}
                className="testimonial-card"
              >
                <Card className="h-full border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl hover:from-white/10 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 group overflow-hidden relative">
                  {/* Top accent line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Quote mark */}
                  <div className="absolute top-6 right-6 text-7xl text-white/5 font-serif select-none">
                    "
                  </div>

                  <CardContent className="pt-10 pb-10 relative z-10">
                    {/* Stars */}
                    <motion.div
                      className="flex items-center gap-1 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 300 }}
                        >
                          <Star className="w-6 h-6 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Quote */}
                    <blockquote className="text-gray-200 mb-8 text-lg leading-relaxed font-light relative z-10">
                      <span className="text-5xl text-amber-500/30 mr-2 font-serif font-bold">"</span>
                      {testimonial.content}
                      <span className="text-5xl text-amber-500/30 ml-2 font-serif font-bold">"</span>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="relative"
                      >
                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover relative border-2 border-white/10"
                        />
                      </motion.div>
                      <div>
                        <div className="font-bold text-white text-lg mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Bottom glow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-32 px-4 relative z-20 overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-600" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`cta-particle-${i}`}
            className="absolute w-2 h-2 bg-white/25 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-30, 30],
              x: [-20, 20],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 5000 + Math.random() * 3000,
              repeat: Infinity,
              delay: Math.random() * 3000,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            className="cta-content text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-8 px-6 py-3 bg-white/15 border border-white/30 text-white backdrop-blur-xl text-sm font-semibold">
                🚀 Join 10,000+ Farmers & Buyers
              </Badge>
            </motion.div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
              Ready to Transform<br />
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundSize: '200% auto'
                }}
              >
                Your Agricultural Business?
              </motion.span>
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Join the blockchain revolution in agriculture. Thousands of farmers and buyers are already trading
              with complete transparency, fair pricing, and cutting-edge technology.
            </motion.p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.06, y: -6 }}
                whileTap={{ scale: 0.94 }}
                className="cta-pulse"
              >
                <Button
                  size="lg"
                  className="px-12 py-8 text-lg font-bold bg-white text-emerald-700 hover:bg-gray-50 shadow-2xl hover:shadow-white/40 border-0 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  <Leaf className="w-7 h-7 mr-3 relative z-10" />
                  <span className="relative z-10">Join as Farmer</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.06, y: -6 }}
                whileTap={{ scale: 0.94 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="px-12 py-8 text-lg font-semibold border-3 border-white text-white hover:bg-white hover:text-emerald-700 transition-all duration-300 backdrop-blur-md group"
                >
                  <TrendingUp className="w-7 h-7 mr-3 group-hover:scale-125 transition-transform" />
                  <span>Start Buying</span>
                </Button>
              </motion.div>
            </div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {[
                { icon: CheckCircle, text: 'Free Forever' },
                { icon: Shield, text: 'Bank-Grade Security' },
                { icon: Zap, text: 'Instant Payouts' },
                { icon: Headphones, text: '24/7 WhatsApp Support' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.5, type: "spring" }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="font-medium text-sm md:text-base text-white">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex items-center justify-center gap-10 flex-wrap text-white/70 text-sm font-medium"
            >
              {[
                { icon: 'polygon', text: 'Polygon Blockchain' },
                { icon: 'lock', text: '256-bit SSL' },
                { icon: 'cert', text: 'ISO 27001 Certified' },
                { icon: 'server', text: '99.9% Uptime' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    {item.icon === 'polygon' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                    {item.icon === 'lock' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                    )}
                    {item.icon === 'cert' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                    {item.icon === 'server' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                      </svg>
                    )}
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-b from-slate-900 to-black relative z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-60" />
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl">
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    FarmBid
                  </span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md leading-relaxed font-light">
                  Revolutionizing agricultural trade through blockchain technology.
                  Connecting farmers directly with buyers for fair, transparent pricing.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Globe className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Shield className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Award className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Platform Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Platform</h3>
                <ul className="space-y-3 text-gray-400">
                  {['How it Works', 'For Farmers', 'For Buyers', 'Pricing'].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                        <span className="w-0 h-0.5 bg-emerald-500 group-hover:w-4 transition-all duration-300" />
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Support</h3>
                <ul className="space-y-3 text-gray-400">
                  {['Help Center', 'Contact Us', 'API Docs', 'Status'].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                        <span className="w-0 h-0.5 bg-emerald-500 group-hover:w-4 transition-all duration-300" />
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm font-light">
                © 2026 FarmBid. All rights reserved. Powered by{' '}
                <span className="text-emerald-400 font-semibold">Blockchain Technology</span>.
              </p>
              <div className="text-gray-500 text-sm font-light">
                Made with ❤️ for Farmers
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

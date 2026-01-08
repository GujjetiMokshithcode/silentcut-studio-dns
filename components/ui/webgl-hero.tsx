"use client"

import { useEffect, useRef, useState } from "react"
import { Scissors, ArrowRight, Menu, X } from "lucide-react"

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_intensity;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Glitch functions
  float glitchNoise(float t) {
    return fract(sin(t * 43758.5453) * 1000.0);
  }
  
  float glitchBlock(float t) {
    float speed = 10.0;
    float blockTime = floor(t * speed);
    return step(0.92, glitchNoise(blockTime));
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = (uv - 0.5) * 2.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    float time = u_time * 0.08;
    
    // Glitch displacement
    float glitchStrength = glitchBlock(u_time * 0.5);
    float lineGlitch = step(0.97, glitchNoise(floor(uv.y * 50.0) + u_time * 5.0)) * glitchStrength;
    
    // Apply glitch offset to UV
    vec2 glitchUV = uv;
    glitchUV.x += (glitchNoise(floor(uv.y * 30.0) + u_time * 3.0) - 0.5) * 0.03 * glitchStrength;
    glitchUV.x += lineGlitch * 0.05 * (glitchNoise(u_time) - 0.5);
    
    vec2 glitchST = (glitchUV - 0.5) * 2.0;
    glitchST.x *= u_resolution.x / u_resolution.y;
    
    float flow1 = fbm(glitchST * 1.2 + vec2(time * 0.5, time * 0.3));
    float flow2 = fbm(glitchST * 1.8 - vec2(time * 0.3, time * 0.4));
    float flow3 = fbm(glitchST * 2.5 + vec2(time * 0.2, -time * 0.2));
    
    float combinedFlow = flow1 * 0.5 + flow2 * 0.3 + flow3 * 0.2;
    
    float bands = sin((glitchST.x + combinedFlow * 0.8) * 4.0 + time * 2.0) * 0.5 + 0.5;
    bands *= sin((glitchST.x + combinedFlow * 0.5) * 8.0 - time * 1.5) * 0.5 + 0.5;
    bands = smoothstep(0.2, 0.8, bands);
    
    float wave = sin(glitchST.y * 2.0 + combinedFlow * 3.0 + time * 1.5) * 0.5 + 0.5;
    float shape = smoothstep(0.0, 1.0, 1.0 - abs(glitchST.x + combinedFlow * 0.6) * 0.8);
    shape *= smoothstep(0.0, 0.5, wave);
    
    float intensity = shape * bands * (0.7 + combinedFlow * 0.5);
    
    float centerMask = 1.0 - smoothstep(0.2, 0.9, 1.0 - length(glitchST * vec2(0.5, 0.8)));
    intensity *= mix(0.4, 1.0, centerMask);
    
    vec3 warmWhite = vec3(1.0, 0.98, 0.95);
    vec3 coolWhite = vec3(0.95, 0.97, 1.0);
    vec3 color = mix(coolWhite, warmWhite, combinedFlow);
    
    vec3 result = color * intensity * 0.9;
    result += smoothstep(0.3, 0.9, intensity) * 0.25 * color;
    
    float vignette = smoothstep(0.0, 0.65, 1.0 - length(uv - 0.5) * 0.95);
    
    vec3 bgTop = vec3(0.04, 0.04, 0.05);
    vec3 bgBottom = vec3(0.01, 0.01, 0.015);
    vec3 bg = mix(bgBottom, bgTop, uv.y);
    
    result = mix(bg, result, smoothstep(0.0, 0.2, intensity));
    result *= vignette;
    
    // Chromatic aberration glitch
    float chromaOffset = 0.003 * glitchStrength;
    vec3 chromaResult = result;
    chromaResult.r = mix(result.r, result.r * 1.1, glitchStrength);
    chromaResult.b = mix(result.b, result.b * 0.9, glitchStrength);
    result = mix(result, chromaResult, 0.5);
    
    // Scanline glitch
    float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.02 * (1.0 + glitchStrength * 2.0);
    result += scanline;
    
    // Random bright line flicker
    result += lineGlitch * 0.15;
    
    // Film grain
    result += (hash(uv * u_time * 0.5) - 0.5) * 0.025;
    
    gl_FragColor = vec4(result, 1.0);
  }
`


// Rotating Outcome Word
function RotatingWord() {
    const words = ["human", "seamless", "natural", "better"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="inline-block relative h-[1.15em] w-[4.5em] overflow-hidden align-bottom">
            {words.map((word, index) => (
                <span
                    key={word}
                    className="absolute left-0 right-0 transition-all duration-500 ease-in-out text-white"
                    style={{
                        transform: index === currentIndex
                            ? 'translateY(0)'
                            : index === (currentIndex - 1 + words.length) % words.length
                                ? 'translateY(-100%)'
                                : 'translateY(100%)',
                        opacity: index === currentIndex ? 1 : 0,
                    }}
                >
                    {word}
                </span>
            ))}
        </span>
    );
}

// Before/After Waveform
function WaveformPreview() {
    const [showAfter, setShowAfter] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setShowAfter(prev => !prev), 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <div className="text-center mb-3">
                <span className={`text-xs uppercase tracking-widest transition-colors duration-500 ${showAfter ? 'text-white/50' : 'text-white/30'
                    }`}>
                    {showAfter ? 'after — smooth flow' : 'before — awkward pauses'}
                </span>
            </div>

            <div className="relative h-24 md:h-32 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08]">
                <div className="absolute inset-0 flex items-center justify-center gap-[3px] px-6">
                    {Array.from({ length: 80 }).map((_, i) => {
                        const isGap = !showAfter && (
                            (i >= 18 && i <= 26) ||
                            (i >= 45 && i <= 55) ||
                            (i >= 68 && i <= 73)
                        );

                        const height = isGap
                            ? 6
                            : 30 + Math.sin(i * 0.25) * 20 + (Math.sin(i * 0.7) * 15);

                        return (
                            <div
                                key={i}
                                className={`w-1 md:w-1.5 rounded-full transition-all duration-700 ${isGap
                                    ? 'bg-white/20'
                                    : showAfter
                                        ? 'bg-white/70'
                                        : 'bg-white/40'
                                    }`}
                                style={{
                                    height: `${height}%`,
                                    transitionDelay: `${i * 8}ms`
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Premium Navigation Component
function Navigation({ onTryFree, isScrolled }: { onTryFree?: () => void; isScrolled: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
                }`}
        >
            <div className="max-w-5xl mx-auto px-4">
                <nav
                    className={`
            relative flex items-center justify-between
            px-4 sm:px-5
            h-12
            rounded-2xl
            transition-all duration-300
            ${isScrolled
                            ? 'bg-black/20 backdrop-blur-md border border-white/[0.05]'
                            : 'bg-transparent'
                        }
          `}
                >
                    {/* Logo */}
                    <a
                        href="/"
                        className="flex items-center gap-2.5 px-2 py-1.5 -ml-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
                    >
                        <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                            <Scissors className="w-3.5 h-3.5 text-black" />
                        </div>
                        <span className="text-sm font-semibold text-white">SilentCut</span>
                    </a>

                    {/* Center Links - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        <a
                            href="#how-it-works"
                            className="relative px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors group"
                        >
                            How it works
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-white/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                        <a
                            href="#features"
                            className="relative px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors group"
                        >
                            Features
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-white/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                    </div>

                    {/* CTA - Desktop */}
                    <button
                        onClick={onTryFree}
                        className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 hover:-translate-y-px active:translate-y-0 transition-all"
                    >
                        Try free
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 -mr-2 text-white/70 hover:text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.08]">
                        <div className="flex flex-col gap-2">
                            <a
                                href="#how-it-works"
                                className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                How it works
                            </a>
                            <a
                                href="#features"
                                className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </a>
                            <button
                                onClick={() => { onTryFree?.(); setMobileMenuOpen(false); }}
                                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg"
                            >
                                Try free
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

interface WebGLHeroProps {
    onTryFree?: () => void;
}

export default function WebGLHero({ onTryFree }: WebGLHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>(0)
    const startTimeRef = useRef<number>(Date.now())
    const [isScrolled, setIsScrolled] = useState(false)

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" })
        if (!gl) return

        const vertShader = gl.createShader(gl.VERTEX_SHADER)!
        gl.shaderSource(vertShader, vertexShader)
        gl.compileShader(vertShader)

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!
        gl.shaderSource(fragShader, fragmentShader)
        gl.compileShader(fragShader)

        const program = gl.createProgram()!
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
        gl.linkProgram(program)

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

        const positionLocation = gl.getAttribLocation(program, "position")
        const timeLocation = gl.getUniformLocation(program, "u_time")
        const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
        const intensityLocation = gl.getUniformLocation(program, "u_intensity")

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio, 1.5)
            canvas.width = canvas.offsetWidth * dpr
            canvas.height = canvas.offsetHeight * dpr
            gl.viewport(0, 0, canvas.width, canvas.height)
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        let lastFrame = 0
        const animate = (timestamp: number) => {
            if (timestamp - lastFrame >= 33) {
                lastFrame = timestamp
                const time = (Date.now() - startTimeRef.current) * 0.001
                gl.useProgram(program)
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
                gl.enableVertexAttribArray(positionLocation)
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
                gl.uniform1f(timeLocation, time)
                gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
                gl.uniform1f(intensityLocation, 1.0)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
            animationRef.current = requestAnimationFrame(animate)
        }
        animationRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-black">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#050508" }} />

            {/* Premium Navigation */}
            <Navigation onTryFree={onTryFree} isScrolled={isScrolled} />

            {/* Hero Content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-16">
                <div className="text-center max-w-3xl">

                    {/* Kicker */}
                    <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/40 mb-6">
                        Fix Audio Pauses Instantly
                    </p>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                        <span className="text-white/60">Make narration sound </span>
                        <RotatingWord />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-white/40">
                        SilentCut removes unnatural pauses from audio in seconds — no editing, no re-recording.
                    </p>

                    {/* Before/After Preview */}
                    <WaveformPreview />

                    {/* CTA */}
                    <div className="mt-10">
                        <button
                            onClick={onTryFree}
                            className="px-10 py-4 bg-white text-black font-semibold text-lg rounded-xl hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Try it free — no signup
                        </button>
                    </div>

                </div>
            </div>
        </section>
    )
}

export { WebGLHero }

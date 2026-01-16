"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  X,
  ArrowUpRight,
  Check,
  Globe,
  Zap,
  Cpu,
  Layout,
  Newspaper,
  BrainCircuit,
  Landmark,
  Users,
  ShieldCheck,
  Target,
  Code,
  Award,
  Monitor,
  MessageSquare,
  Loader2,
  ChevronDown,
  TrendingUp,
  Key,
  Disc,
  Timer,
  MousePointer2,
  ShieldAlert,
  Accessibility,
  Headphones,
  UserCheck,
} from "lucide-react"

// --- 1. CONFIGURATION & PALETTE STRICTE B2B ---
const PALETTE = {
  // Fonds
  bg: "#FBF7F2", // ivoire
  surface: "#FFFFFF", // blanc
  surfaceAlt: "#F3EEE7", // ivoire foncé
  // Textes
  text: "#0B132B", // bleu nuit
  textMuted: "#3A4158", // dérivé bleu nuit clair
  // Bordures
  border: "#0B132B",
  // CTA Principal (bleu pétrole)
  primary: "#1C7293",
  primaryHover: "#155B75",
  primaryContrast: "#FFFFFF",
  // Secondaire (terracotta)
  secondary: "#E07A5F",
  secondarySoft: "#F2C2B4",
  // Accent neutre
  accent: "#CBD5E1",
  // Cartes colorées
  cardBlue: "#D6E7ED", // dérivé clair bleu pétrole
  cardTerracotta: "#F2C2B4", // terracotta pastel
  cardNeutral: "#F3EEE7", // ivoire foncé
}

const ASSETS = {
  logosPartenaires: [
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    "https://cdn.worldvectorlogo.com/logos/nvidia.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mistral_AI_logo_%282025%E2%80%93%29.svg/640px-Mistral_AI_logo_%282025%E2%80%93%29.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Google_Gemini_logo_2025.svg/640px-Google_Gemini_logo_2025.svg.png",
  ],
}

// --- 2. HOOKS & UTILS ---

const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold },
    )
    const currentRef = ref.current
    if (currentRef) observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [threshold])
  return [ref, isInView] as const
}

const callGemini = async (prompt: string, systemInstruction: string, isJson = false) => {
  const apiKey = ""
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: isJson ? { responseMimeType: "application/json" } : {},
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return isJson ? JSON.parse(text.replace(/\*\*/g, "")) : text.replace(/\*\*/g, "")
  } catch (e) {
    console.error("Gemini API Error:", e)
    return isJson
      ? {
          profil: "Professionnel",
          formation: "Cursus IA Stratégique",
          raison: "Une recommandation adaptée.",
          duree: "Flexible",
        }
      : "Erreur."
  }
}

// --- 3. UI COMPONENTS ATOMIQUES ---

const BrandLogo = ({ className = "" }: { size?: string; className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img src="/images/logo.png" alt="NOMA" className="h-16 md:h-20 w-auto object-contain" />
  </div>
)

const BrutalCard = ({
  children,
  className = "",
  bgColor = PALETTE.surface,
  isHoverable = false,
  shadowColor = PALETTE.border,
  style = {},
  onClick,
}: {
  children: React.ReactNode
  className?: string
  bgColor?: string
  isHoverable?: boolean
  shadowColor?: string
  style?: React.CSSProperties
  onClick?: () => void
}) => (
  <div
    onClick={onClick}
    style={{
      boxShadow: `8px 8px 0px 0px ${shadowColor}`,
      backgroundColor: bgColor,
      ...style,
    }}
    className={`border-[2.5px] border-[#0B132B] rounded-[50px] ${isHoverable ? "hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300" : ""} ${className}`}
  >
    {children}
  </div>
)

const BrutalButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "black" | "white"
  className?: string
  onClick?: () => void
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: PALETTE.primary, color: PALETTE.primaryContrast },
    secondary: { backgroundColor: PALETTE.secondary, color: PALETTE.primaryContrast },
    black: { backgroundColor: PALETTE.border, color: PALETTE.primaryContrast },
    white: { backgroundColor: PALETTE.surface, color: PALETTE.text },
  }
  return (
    <button
      style={styles[variant] || styles.primary}
      className={`px-8 py-4 rounded-[25px] font-black uppercase tracking-widest text-[10px] border-[2.5px] border-[#0B132B] shadow-[5px_5px_0px_0px_rgba(11,19,43,1)] active:shadow-none transition-all flex items-center justify-center gap-3 hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// --- 4. COMPOSANTS DE SECTION ---

interface CourseType {
  title: string
  cat: string
  duration: string
  level: string
  price: string
  color: string
  icon: React.ElementType
  longDesc: string
}

const ModaleDetail = ({
  isOpen,
  onClose,
  content,
  onNavigate,
}: { isOpen: boolean; onClose: () => void; content: CourseType | null; onNavigate?: (page: string) => void }) => {
  if (!isOpen || !content) return null
  const IconComp = content.icon
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in duration-300 text-left"
      style={{ backgroundColor: `${PALETTE.border}E6` }}
    >
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        className="relative w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden z-10 p-8 md:p-16"
        style={{ backgroundColor: PALETTE.surface, borderColor: `${PALETTE.border}0D`, borderWidth: "6px" }}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full transition-all hover:rotate-90"
          style={{ backgroundColor: `${PALETTE.border}0D`, color: PALETTE.text }}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-4 text-left" style={{ color: PALETTE.text }}>
              <div
                className="p-4 rounded-2xl shadow-inner"
                style={{ backgroundColor: PALETTE.surfaceAlt, borderColor: `${PALETTE.border}0D`, borderWidth: "1px" }}
              >
                {IconComp && <IconComp size={40} strokeWidth={1.5} color={PALETTE.primary} />}
              </div>
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full"
                style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
              >
                FORMATION
              </span>
            </div>
            <h2
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
              style={{ color: PALETTE.text }}
            >
              {content.title}
            </h2>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { icon: Timer, label: "Durée", val: content.duration },
              { icon: Target, label: "Niveau", val: content.level },
              { icon: Award, label: "Certification", val: "NOMA / Qualiopi" },
              { icon: Disc, label: "Accès", val: "À vie" },
            ].map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <div
                  key={i}
                  className="p-5 rounded-3xl flex flex-col gap-2"
                  style={{
                    backgroundColor: PALETTE.surfaceAlt,
                    borderColor: `${PALETTE.border}0D`,
                    borderWidth: "1px",
                  }}
                >
                  <StatIcon size={20} strokeWidth={1.5} color={PALETTE.primary} />
                  <div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: PALETTE.textMuted }}
                    >
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold leading-none" style={{ color: PALETTE.text }}>
                      {stat.val}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <p
            className="text-xl md:text-2xl font-bold leading-tight italic pl-8 text-left"
            style={{ borderLeftWidth: "12px", borderLeftColor: PALETTE.primary, color: PALETTE.text }}
          >
            {content.longDesc}
          </p>
          <footer className="grid md:grid-cols-2 gap-4 pt-6">
            <BrutalButton
              variant="white"
              className="w-full !py-6 uppercase"
              onClick={() =>
                (window.location.href =
                  "mailto:contact@noma-formation.fr?subject=Demande de programme - " + content.title)
              }
            >
              Demander le programme
            </BrutalButton>
            <BrutalButton
              variant="primary"
              className="w-full !py-6 uppercase text-center"
              onClick={() => {
                onClose()
                onNavigate?.("formations")
              }}
            >
              {"S'inscrire maintenant"}
            </BrutalButton>
          </footer>
        </div>
      </div>
    </div>
  )
}

const SectionHero = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <section
    className="relative pt-48 pb-32 px-6 md:px-12 overflow-hidden text-center"
    style={{ borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
  >
    {/* Background image */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
    <div
      className="absolute inset-0 z-[1] backdrop-blur-[1px] md:backdrop-blur-[1px]"
      style={{
        background: `linear-gradient(180deg, rgba(251,247,242,0.75) 0%, rgba(251,247,242,0.65) 35%, rgba(251,247,242,0.80) 100%)`,
      }}
    />
    <div
      className="absolute inset-0 z-[1] md:hidden"
      style={{
        background: `linear-gradient(180deg, rgba(251,247,242,0.85) 0%, rgba(251,247,242,0.75) 35%, rgba(251,247,242,0.90) 100%)`,
      }}
    />
    <div className="bg-grain absolute inset-0 z-[2] opacity-[0.05] pointer-events-none"></div>
    <div className="max-w-[1400px] mx-auto relative z-10" style={{ color: PALETTE.text }}>
      <div className="inline-flex flex-col md:flex-row items-center gap-6 mb-12">
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
          style={{
            backgroundColor: PALETTE.surface,
            borderWidth: "2.5px",
            borderColor: PALETTE.border,
            boxShadow: `4px 4px 0px 0px ${PALETTE.primary}`,
          }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">
            100% E-LEARNING CERTIFIÉ QUALIOPI
          </span>
        </div>
        <div
          className="hidden lg:flex items-center gap-2 font-mono uppercase text-[8px] font-black text-left"
          style={{ color: PALETTE.textMuted }}
        >
          <ShieldCheck size={14} /> QUALIOPI CERTIFIÉ
        </div>
      </div>
      <h1 className="text-6xl md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase mb-12 text-center">
        {"MAÎTRISEZ L'IA GÉNÉRATIVE POUR VOTRE MÉTIER."}
      </h1>
      <p
        className="text-lg md:text-xl font-medium max-w-5xl mx-auto mb-16 leading-relaxed italic text-center"
        style={{ color: PALETTE.textMuted }}
      >
        {
          "Intégrez l'intelligence artificielle dans votre quotidien professionnel pour automatiser vos tâches répétitives et libérer du temps stratégique. Prise en charge jusqu'à 100% selon vos droits CPF ou OPCO."
        }
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <BrutalButton onClick={() => onNavigate("formations")}>Découvrir les cursus</BrutalButton>
        <BrutalButton
          variant="white"
          onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
        >
          Tester un module (5 min)
        </BrutalButton>
      </div>
    </div>
  </section>
)

const SectionCibles = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const targets = [
    {
      title: "Salariés",
      desc: "Automatisez vos processus internes et sécurisez votre évolution.",
      color: PALETTE.cardNeutral,
      iconColor: PALETTE.primary,
      icon: Users,
    },
    {
      title: "Indépendants",
      desc: "Augmentez votre capacité de livraison sans rallonger vos journées.",
      color: PALETTE.secondarySoft,
      iconColor: PALETTE.secondary,
      icon: MousePointer2,
    },
    {
      title: "Managers",
      desc: "Pilotez la transformation IA de votre équipe et gagnez en vision.",
      color: PALETTE.cardBlue,
      iconColor: PALETTE.primary,
      icon: TrendingUp,
    },
    {
      title: "Chefs d'entreprise",
      desc: "Optimisez la rentabilité globale de votre structure grâce à l'IA.",
      color: PALETTE.surfaceAlt,
      iconColor: PALETTE.textMuted,
      icon: Layout,
    },
  ]
  return (
    <section
      className="py-24 text-left"
      style={{ backgroundColor: PALETTE.surface, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
    >
      <div className="max-w-[1400px] mx-auto px-6 text-left">
        <h2
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 text-left"
          style={{ color: PALETTE.text }}
        >
          IDENTIFIEZ VOTRE OBJECTIF
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {targets.map((t, idx) => {
            const IconComp = t.icon
            return (
              <BrutalCard
                key={idx}
                bgColor={t.color}
                className="p-10 min-h-[300px] flex flex-col justify-between cursor-pointer"
                isHoverable
                shadowColor={PALETTE.border}
                onClick={() => onNavigate("formations")}
              >
                <div
                  className="p-4 rounded-2xl w-fit shadow-sm"
                  style={{ backgroundColor: PALETTE.surface, borderWidth: "2px", borderColor: `${PALETTE.border}1A` }}
                >
                  <IconComp size={28} strokeWidth={2} style={{ color: t.iconColor }} />
                </div>
                <div className="text-left" style={{ color: PALETTE.text }}>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{t.title}</h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: PALETTE.textMuted }}>
                    {t.desc}
                  </p>
                  <button
                    className="mt-6 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-full shadow-[4px_4px_0px_0px_rgba(11,19,43,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    style={{
                      backgroundColor: PALETTE.border,
                      color: PALETTE.primaryContrast,
                      borderWidth: "2px",
                      borderColor: PALETTE.border,
                    }}
                  >
                    Voir mon parcours →
                  </button>
                </div>
              </BrutalCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const SectionCatalogue = ({
  courses,
  onSelect,
  onNavigate,
}: { courses: CourseType[]; onSelect: (course: CourseType) => void; onNavigate?: (page: string) => void }) => (
  <section
    id="formations-catalogue"
    className="py-32 text-left"
    style={{ backgroundColor: PALETTE.surfaceAlt, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
  >
    <div className="max-w-[1400px] mx-auto px-6 text-left" style={{ color: PALETTE.text }}>
      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4" style={{ color: PALETTE.text }}>
        NOS FORMATIONS MÉTIERS
      </h2>
      <p className="text-xl font-bold mb-12 italic" style={{ color: PALETTE.textMuted }}>
        Des parcours structurés, accessibles 24h/24, conçus par des experts du terrain.
      </p>
      <div className="grid md:grid-cols-2 gap-12 mb-24">
        {courses.map((f, i) => {
          const IconComp = f.icon
          return (
            <BrutalCard
              key={i}
              bgColor={f.color}
              className="p-12 min-h-[450px] flex flex-col justify-between relative group overflow-hidden"
              isHoverable
              shadowColor={PALETTE.border}
            >
              <div className="absolute top-[-40px] right-[-40px] opacity-[0.1] group-hover:opacity-20 transition-all duration-700 pointer-events-none">
                {IconComp && <IconComp size={350} strokeWidth={0.5} />}
              </div>
              <div className="relative z-10 text-left">
                <div className="flex justify-between items-start mb-12 text-left">
                  <div className="flex flex-col gap-2">
                    <span
                      className="px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase w-fit"
                      style={{
                        backgroundColor: PALETTE.border,
                        color: PALETTE.primaryContrast,
                        borderWidth: "1px",
                        borderColor: `${PALETTE.border}33`,
                      }}
                    >
                      NOMA 0{i + 1}
                    </span>
                    <p className="text-[10px] font-black uppercase" style={{ color: PALETTE.textMuted }}>
                      E-LEARNING • {f.duration} • {f.level}
                    </p>
                  </div>
                  <span className="text-[16px] font-bold font-mono" style={{ color: PALETTE.secondary }}>
                    Dès {f.price}
                  </span>
                </div>
                <h3
                  className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-none mb-6"
                  style={{ color: PALETTE.text }}
                >
                  {f.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed mb-8 max-w-md" style={{ color: PALETTE.textMuted }}>
                  {f.longDesc}
                </p>
              </div>
              <div className="grid gap-4 relative z-10 text-left">
                <BrutalButton variant="black" onClick={() => onSelect(f)}>
                  Consulter le programme
                </BrutalButton>
                <BrutalButton
                  variant="white"
                  className="!py-3 !text-[8px]"
                  onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {"Tester l'extrait gratuit"}
                </BrutalButton>
              </div>
            </BrutalCard>
          )
        })}
      </div>

      <div
        className="pt-12 overflow-hidden relative"
        style={{ borderTopWidth: "2.5px", borderTopColor: `${PALETTE.border}1A` }}
      >
        <div className="flex animate-marquee items-center mb-8">
          {[...ASSETS.logosPartenaires, ...ASSETS.logosPartenaires].map((logoPath, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center p-10 rounded-[45px] mx-10"
              style={{
                backgroundColor: PALETTE.surface,
                borderWidth: "2px",
                borderColor: PALETTE.border,
                boxShadow: `8px 8px 0px 0px ${PALETTE.border}`,
              }}
            >
              <img
                src={logoPath || "/placeholder.svg"}
                alt="Outil IA"
                className="w-16 h-16 object-contain"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
        <h2
          className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-center mt-6"
          style={{ color: PALETTE.text }}
        >
          OUTILS ET MODÈLES ENSEIGNÉS
        </h2>
      </div>
    </div>
  </section>
)

const SectionProofs = () => (
  <section
    className="py-24 text-left"
    style={{ backgroundColor: PALETTE.bg, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
  >
    <div className="max-w-[1400px] mx-auto px-6 text-left" style={{ color: PALETTE.text }}>
      <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter mb-6" style={{ color: PALETTE.text }}>
        VOTRE RÉUSSITE EST NOTRE RÉFÉRENCE
      </h2>
      <p className="text-xl font-bold mb-12 italic text-left" style={{ color: PALETTE.textMuted }}>
        La garantie d'une pédagogie d'excellence validée par nos apprenants et les instances certifiées.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Award,
            title: "Qualiopi",
            desc: "Processus certifié garantissant l'éligibilité aux financements publics.",
            color: PALETTE.surfaceAlt,
          },
          {
            icon: MessageSquare,
            title: "Satisfaction",
            desc: "98% d'avis positifs (moyenne sur 500 avis certifiés en 2025).",
            color: PALETTE.cardBlue,
          },
          {
            icon: ShieldCheck,
            title: "Communauté",
            desc: "+1500 professionnels certifiés par NOMA depuis 2025.",
            color: PALETTE.secondarySoft,
          },
        ].map((proof, i) => {
          const IconComp = proof.icon
          return (
            <BrutalCard
              key={i}
              bgColor={proof.color}
              className="p-10 flex flex-col"
              isHoverable
              shadowColor={PALETTE.border}
            >
              <IconComp size={32} className="mb-6" style={{ color: PALETTE.text }} />
              <h4 className="text-xl font-black mb-2 uppercase" style={{ color: PALETTE.text }}>
                {proof.title}
              </h4>
              <p className="text-sm italic" style={{ color: PALETTE.textMuted }}>
                {proof.desc}
              </p>
            </BrutalCard>
          )
        })}
      </div>
    </div>
  </section>
)

const SectionQuizOrientation = () => {
  const [step, setStep] = useState(0)
  const [resultat, setResultat] = useState<{
    profil: string
    formation: string
    raison: string
    duree?: string
  } | null>(null)
  const [chargement, setChargement] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const questions = [
    {
      key: "metier",
      label: "Quel est votre métier actuel ?",
      options: ["Manager", "Indépendant", "Salarié", "Chef d'entreprise"],
    },
    {
      key: "objectif",
      label: "Votre objectif prioritaire ?",
      options: ["Gagner du temps", "Productivité Tech", "Stratégie IA", "Optimisation ROI"],
    },
    { key: "niveau", label: "Votre niveau actuel en IA ?", options: ["Débutant", "Utilisateur régulier", "Avancé"] },
    { key: "temps", label: "Temps disponible par semaine ?", options: ["Moins de 2h", "2h à 5h", "Plus de 5h"] },
    {
      key: "outils",
      label: "Outils déjà manipulés ?",
      options: ["ChatGPT", "Midjourney/Canva", "Automatisation", "Aucun"],
    },
  ]

  const handleNext = (val: string) => {
    const nextAnswers = { ...answers, [questions[step].key]: val }
    setAnswers(nextAnswers)
    if (step < questions.length - 1) setStep(step + 1)
    else lancerAnalyse(nextAnswers)
  }

  const lancerAnalyse = async (final: Record<string, string>) => {
    setChargement(true)
    const prompt = `Recommande un cursus IA NOMA parmi (Architecte Deep Learning, Design de Prompt Stratégique, Workflows Opérationnels, Meta-IA) pour ce profil : ${JSON.stringify(final)}. Réponds en JSON : {"profil": string, "formation": string, "raison": string, "duree": string}.`
    const res = await callGemini(prompt, "Expert orientation e-learning. JSON strict.", true)
    setResultat(res)
    setChargement(false)
  }

  return (
    <section
      id="quiz"
      className="py-32 text-left"
      style={{
        backgroundColor: PALETTE.surface,
        borderBottomWidth: "2.5px",
        borderBottomColor: PALETTE.border,
        color: PALETTE.text,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 text-left">
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-left">
          TROUVEZ VOTRE CURSUS IDÉAL
        </h2>
        <p className="text-xl font-bold mb-8 italic text-left" style={{ color: PALETTE.textMuted }}>
          Vous ne savez pas par où commencer ?
        </p>
        <p
          className="text-xs font-black uppercase mb-10 tracking-widest text-left"
          style={{ color: PALETTE.textMuted }}
        >
          {
            "Complétez ce test en 2 minutes pour obtenir : votre profil d'utilisateur IA + votre recommandation de cursus personnalisée + votre estimation de durée de formation."
          }
        </p>
        <BrutalCard className="p-10 md:p-16" bgColor={PALETTE.secondarySoft} shadowColor={PALETTE.border}>
          <div className="grid md:grid-cols-12 gap-12 items-center text-left">
            <div className="md:col-span-5 flex flex-col gap-6 text-left">
              <h3 className="text-3xl font-extrabold uppercase tracking-tighter" style={{ color: PALETTE.text }}>
                {"QUIZ D'ORIENTATION"}
              </h3>
              {!resultat && !chargement && (
                <div className="animate-in slide-in-from-right duration-300">
                  <p className="text-[10px] font-black uppercase mb-4" style={{ color: PALETTE.textMuted }}>
                    QUESTION {step + 1} / {questions.length}
                  </p>
                  <p className="text-xl font-bold mb-8" style={{ color: PALETTE.text }}>
                    {questions[step].label}
                  </p>
                  <div className="grid gap-3 text-left">
                    {questions[step].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleNext(opt)}
                        className="p-4 rounded-2xl font-bold text-sm text-left transition-all shadow-[4px_4px_0px_0px_#0B132B] active:translate-y-1 active:shadow-none"
                        style={{
                          backgroundColor: PALETTE.surface,
                          borderWidth: "2px",
                          borderColor: PALETTE.border,
                          color: PALETTE.text,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = PALETTE.border
                          e.currentTarget.style.color = PALETTE.primaryContrast
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = PALETTE.surface
                          e.currentTarget.style.color = PALETTE.text
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chargement && (
                <div className="flex items-center gap-4 text-xl font-bold" style={{ color: PALETTE.text }}>
                  <Loader2 className="animate-spin" /> Analyse du profil...
                </div>
              )}
            </div>
            <div
              className="md:col-span-7 min-h-[420px] relative overflow-hidden rounded-[40px] p-10 flex flex-col justify-center text-left"
              style={{ backgroundColor: PALETTE.surfaceAlt, borderWidth: "2px", borderColor: PALETTE.border }}
            >
              {resultat ? (
                <div className="animate-in fade-in duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: PALETTE.primary }}>
                    Profil : {resultat.profil}
                  </span>
                  <h4 className="text-4xl font-black uppercase mt-2 mb-4" style={{ color: PALETTE.text }}>
                    {resultat.formation}
                  </h4>
                  <p className="text-sm font-black uppercase mb-6" style={{ color: PALETTE.textMuted }}>
                    Durée estimée : {resultat.duree || "Selon programme"}
                  </p>
                  <p className="text-lg italic leading-relaxed mb-8" style={{ color: PALETTE.textMuted }}>
                    {'"'}
                    {resultat.raison}
                    {'"'}
                  </p>
                  <BrutalButton
                    variant="black"
                    onClick={() => {
                      setStep(0)
                      setResultat(null)
                    }}
                  >
                    Recommencer le test
                  </BrutalButton>
                </div>
              ) : (
                !chargement && (
                  <div className="text-center flex flex-col items-center" style={{ color: PALETTE.textMuted }}>
                    <MousePointer2 size={64} className="mb-6 animate-bounce" />
                    <p className="font-black uppercase tracking-widest text-center">
                      {"Démarrer le quiz d'orientation"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </BrutalCard>
      </div>
    </section>
  )
}

const SectionWorkflow = () => {
  const bgColors = [PALETTE.cardNeutral, PALETTE.secondarySoft, PALETTE.cardBlue, PALETTE.surfaceAlt]
  const steps = [
    {
      title: "Accès immédiat",
      desc: "Réception de vos accès plateforme dès la validation de votre dossier.",
      icon: Key,
    },
    { title: "Pratique réelle", desc: "Apprentissage par l'action sur les outils leaders du marché.", icon: Code },
    { title: "Accompagnement", desc: "Support pédagogique et technique disponible sous 24h.", icon: MessageSquare },
    { title: "Certification", desc: "Validation de vos acquis et remise de votre certificat NOMA.", icon: Award },
  ]
  return (
    <section
      className="py-32 text-left"
      style={{ backgroundColor: PALETTE.bg, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <h2
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 text-left"
          style={{ color: PALETTE.text }}
        >
          COMMENT ÇA MARCHE ?
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center mt-12">
          {steps.map((s, idx) => {
            const IconComp = s.icon
            return (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto"
                  style={{
                    backgroundColor: bgColors[idx],
                    borderWidth: "2px",
                    borderColor: PALETTE.border,
                    boxShadow: `4px 4px 0px 0px ${PALETTE.border}`,
                    color: PALETTE.text,
                  }}
                >
                  <IconComp size={24} />
                </div>
                <h3 className="text-xl font-black mb-2 uppercase text-center" style={{ color: PALETTE.text }}>
                  {s.title}
                </h3>
                <p className="text-sm font-medium text-center" style={{ color: PALETTE.textMuted }}>
                  {s.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const SectionFinancing = ({ onNavigate }: { onNavigate?: (page: string) => void }) => (
  <section
    className="py-24 text-left"
    style={{
      backgroundColor: PALETTE.surface,
      borderBottomWidth: "2.5px",
      borderBottomColor: PALETTE.border,
      color: PALETTE.text,
    }}
  >
    <div className="max-w-[1400px] mx-auto px-6 text-left">
      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 text-left">
        UN INVESTISSEMENT ACCESSIBLE
      </h2>
      <p className="text-xl font-bold mb-12 italic text-left" style={{ color: PALETTE.textMuted }}>
        {
          "Nous simplifions l'accès à la formation. Nos cursus sont éligibles au financement CPF, OPCO et France Travail."
        }
      </p>
      <BrutalCard className="p-12 text-left" bgColor={PALETTE.surfaceAlt}>
        <div className="flex flex-col md:flex-row gap-12 items-center text-left">
          <div className="flex-1 text-left">
            <p className="text-2xl font-bold italic leading-relaxed mb-8 text-left" style={{ color: PALETTE.text }}>
              {
                "Votre formation peut être prise en charge jusqu'à 100% selon vos droits disponibles. Notre équipe vous accompagne gratuitement dans vos démarches administratives."
              }
            </p>
            <BrutalButton variant="black" onClick={() => onNavigate?.("legal")}>
              Consulter les modalités de financement
            </BrutalButton>
          </div>
          <div
            className="p-10 rounded-[40px] text-center"
            style={{
              backgroundColor: PALETTE.surface,
              borderWidth: "2px",
              borderColor: PALETTE.border,
              boxShadow: `10px 10px 0px 0px ${PALETTE.border}`,
            }}
          >
            <ShieldCheck size={48} className="mx-auto mb-4" style={{ color: PALETTE.primary }} />
            <h4 className="text-4xl font-black uppercase leading-none text-center" style={{ color: PALETTE.text }}>
              QUALIOPI
            </h4>
            <span
              className="text-[10px] font-black uppercase block mt-2 text-center"
              style={{ color: PALETTE.textMuted }}
            >
              Certifié Qualité
            </span>
          </div>
        </div>
      </BrutalCard>
    </div>
  </section>
)

const SectionNewsPreview = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const articles = [
    {
      title: "SORA : La révolution vidéo",
      desc: "Analyse du déploiement massif de Sora en entreprise.",
      color: PALETTE.cardBlue,
    },
    {
      title: "Agents Autonomes 2026",
      desc: "Les nouveaux standards de planification assistée par IA.",
      color: PALETTE.secondarySoft,
    },
    {
      title: "L'IA Act & Formation",
      desc: "Comprendre le nouveau cadre réglementaire européen.",
      color: PALETTE.cardNeutral,
    },
  ]
  return (
    <section
      className="py-32 text-left"
      style={{ backgroundColor: PALETTE.bg, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
    >
      <div className="max-w-[1400px] mx-auto px-6 text-left" style={{ color: PALETTE.text }}>
        <div className="flex justify-between items-end mb-10 text-left">
          <div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-left">
              ACTUALITÉS & VEILLE IA
            </h2>
            <p className="text-xl font-bold mt-4 italic text-left" style={{ color: PALETTE.textMuted }}>
              {"Restez à la pointe de l'innovation avec notre analyse des dernières sorties."}
            </p>
          </div>
          <button
            onClick={() => onNavigate("actualites")}
            className="text-xs font-black uppercase underline underline-offset-4 decoration-2 mb-2"
            style={{ textDecorationColor: PALETTE.primary }}
          >
            {"Voir toute l'actualité"}
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-left" style={{ color: PALETTE.text }}>
          {articles.map((art, i) => (
            <BrutalCard
              key={i}
              bgColor={art.color}
              className="p-10 flex flex-col justify-between min-h-[300px]"
              isHoverable
              shadowColor={PALETTE.border}
            >
              <Newspaper size={32} className="mb-6" style={{ color: PALETTE.text }} />
              <div className="text-left">
                <h4
                  className="text-2xl font-black uppercase mb-4 leading-tight text-left"
                  style={{ color: PALETTE.text }}
                >
                  {art.title}
                </h4>
                <p className="text-sm italic text-left" style={{ color: PALETTE.textMuted }}>
                  {art.desc}
                </p>
              </div>
              <ArrowUpRight size={24} className="ml-auto mt-6" style={{ color: PALETTE.text }} />
            </BrutalCard>
          ))}
        </div>
      </div>
    </section>
  )
}

const SectionFAQ = () => {
  const [ouvert, setOuvert] = useState<number | null>(null)
  const faqs = [
    {
      q: "Est-ce adapté si je n'ai aucune base technique ?",
      a: "Oui, nos cursus incluent des modules de mise à niveau. Le quiz d'orientation vous guidera vers le cursus le plus adapté à votre point de départ.",
    },
    {
      q: "Comment mobiliser mon budget CPF ?",
      a: "C'est très simple : nous vous guidons étape par étape pour sélectionner la formation sur MonCompteFormation et valider votre dossier en 48h.",
    },
    {
      q: "Puis-je réellement apprendre à mon rythme ?",
      a: "Absolument. La plateforme e-learning est accessible 24h/24, 7j/7. Vous progressez selon vos disponibilités, sans contrainte horaire.",
    },
    {
      q: "Les formations sont-elles accessibles en situation de handicap ?",
      a: "Oui, NOMA s'engage pour l'inclusion. Nos parcours e-learning respectent les normes d'accessibilité. Contactez notre référent handicap (handicap@noma-formation.fr) pour un aménagement personnalisé.",
    },
    {
      q: "Quels outils sont nécessaires pour suivre les cours ?",
      a: "Un ordinateur récent et une connexion internet stable suffisent. Pour les outils IA payants, nous vous guidons sur les versions gratuites ou les crédits offerts pendant la formation.",
    },
    {
      q: "Peut-on former une équipe entière d'entreprise ?",
      a: "Tout à fait. Nous proposons des tarifs dégressifs et pouvons personnaliser certains modules e-learning pour coller aux process internes de votre structure.",
    },
    {
      q: "Y a-t-il un accompagnement humain ?",
      a: "Bien que 100% e-learning, vous n'êtes pas seul. Un support technique et pédagogique par mentors certifiés est disponible sous 24h ouvrées pour répondre à toutes vos questions.",
    },
  ]
  const colors = [PALETTE.surfaceAlt, PALETTE.cardBlue, PALETTE.secondarySoft, PALETTE.cardNeutral]
  return (
    <section
      id="faq"
      className="py-32 text-left"
      style={{
        backgroundColor: PALETTE.surfaceAlt,
        borderBottomWidth: "2.5px",
        borderBottomColor: PALETTE.border,
        color: PALETTE.text,
      }}
    >
      <div className="max-w-[1000px] mx-auto px-6 text-left">
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 text-left">
          RÉPONSES À VOS QUESTIONS
        </h2>
        <div className="grid gap-6">
          {faqs.map((faq, i) => {
            return (
              <BrutalCard
                key={i}
                className="overflow-hidden"
                isHoverable
                shadowColor={PALETTE.border}
                bgColor={colors[i % 4]}
              >
                <button
                  onClick={() => setOuvert(ouvert === i ? null : i)}
                  className="w-full p-8 flex justify-between items-center text-left"
                  style={{ color: PALETTE.text }}
                >
                  <span className="text-xl font-black uppercase text-left">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${ouvert === i ? "rotate-180" : ""}`} />
                </button>
                {ouvert === i && (
                  <div
                    className="px-8 pb-8 font-medium italic ml-8 text-left"
                    style={{ color: PALETTE.textMuted, borderLeftWidth: "12px", borderLeftColor: PALETTE.primary }}
                  >
                    {faq.a}
                  </div>
                )}
              </BrutalCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const SectionClosing = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <section
    className="py-32 text-center"
    style={{ backgroundColor: PALETTE.cardBlue, borderTopWidth: "2.5px", borderTopColor: PALETTE.border }}
  >
    <h2
      className="text-4xl md:text-7xl font-black uppercase mb-6 text-center leading-[0.9]"
      style={{ color: PALETTE.text }}
    >
      PRÊT À DEVENIR UN <br />
      PRO AUGMENTÉ ?
    </h2>
    <p className="text-xl font-bold mb-12 italic" style={{ color: PALETTE.textMuted }}>
      Rejoignez les 1500 apprenants qui transforment leur productivité avec NOMA.
    </p>
    <BrutalButton variant="primary" onClick={() => onNavigate("formations")} className="mx-auto uppercase">
      Démarrer ma formation maintenant
    </BrutalButton>
  </section>
)

const PageActualitesIA = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string
    date: string
    cat: string
    desc: string
    color: string
    fullContent: string
  } | null>(null)

  const articles = [
    {
      title: "SORA : La révolution vidéo",
      date: "JAN 2026",
      cat: "MODÈLES",
      desc: "Le déploiement massif de Sora redéfinit la production audiovisuelle.",
      color: PALETTE.cardBlue,
      fullContent:
        "OpenAI a officiellement lancé Sora pour le grand public et les entreprises. Ce modèle de génération vidéo par IA transforme radicalement la production de contenu. Les entreprises peuvent désormais créer des vidéos de qualité professionnelle en quelques minutes, réduisant drastiquement les coûts de production. Chez NOMA, nous intégrons déjà Sora dans nos modules de formation pour préparer nos apprenants à cette révolution.",
    },
    {
      title: "L'IA Act Européen",
      date: "JAN 2026",
      cat: "DROIT",
      desc: "Comment la régulation impacte la formation professionnelle en 2026.",
      color: PALETTE.secondarySoft,
      fullContent:
        "L'AI Act européen entre en vigueur progressivement. Cette réglementation classe les systèmes d'IA par niveau de risque et impose des obligations strictes aux entreprises. Pour les organismes de formation comme NOMA, cela signifie adapter nos contenus pour sensibiliser les professionnels aux bonnes pratiques et à la conformité réglementaire.",
    },
    {
      title: "Agents Autonomes 2026",
      date: "DEC 2025",
      cat: "PROFIL",
      desc: "Maîtrisez la planification complexe assistée par agents intelligents.",
      color: PALETTE.cardNeutral,
      fullContent:
        "Les agents IA autonomes représentent la prochaine grande évolution. Capables de planifier, exécuter et itérer sur des tâches complexes, ils transforment la productivité des équipes. Notre cursus 'Workflows IA Opérationnels' vous prépare à orchestrer ces agents pour automatiser vos processus métier.",
    },
    {
      title: "RAG & LLM Locaux",
      date: "NOV 2025",
      cat: "TECH",
      desc: "La confidentialité des données via le déploiement local d'IA.",
      color: PALETTE.surfaceAlt,
      fullContent:
        "Le déploiement de LLM en local avec RAG (Retrieval-Augmented Generation) permet aux entreprises de bénéficier de l'IA tout en gardant le contrôle total de leurs données sensibles. Cette approche est particulièrement pertinente pour les secteurs réglementés comme la finance ou la santé.",
    },
  ]

  return (
    <div
      className="animate-in fade-in duration-1000 text-left pt-48 pb-32 px-6 md:px-12"
      style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}
    >
      <div className="max-w-[1400px] mx-auto text-left">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 text-left">
          ACTUALITÉ IA
        </h1>
        <div className="grid md:grid-cols-2 gap-12 text-left">
          {articles.map((art, i) => (
            <BrutalCard
              key={i}
              bgColor={art.color}
              className="p-12 min-h-[400px] flex flex-col justify-between"
              isHoverable
              shadowColor={PALETTE.border}
            >
              <div className="text-left">
                <div className="flex justify-between items-start mb-10 text-left">
                  <span
                    className="px-4 py-1 rounded-full text-[9px] font-black uppercase text-left"
                    style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
                  >
                    NOMA {art.cat}
                  </span>
                  <span className="font-mono text-xs font-bold" style={{ color: PALETTE.textMuted }}>
                    {art.date}
                  </span>
                </div>
                <h3 className="text-3xl font-black uppercase mb-6 text-left" style={{ color: PALETTE.text }}>
                  {art.title}
                </h3>
                <p className="text-lg font-medium italic text-left" style={{ color: PALETTE.textMuted }}>
                  {art.desc}
                </p>
              </div>
              <BrutalButton
                variant="black"
                className="!py-3 !text-[9px] w-fit text-left"
                onClick={() => setSelectedArticle(art)}
              >
                {"Lire l'article"}
              </BrutalButton>
            </BrutalCard>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in duration-300"
          style={{ backgroundColor: `${PALETTE.border}E6` }}
        >
          <div className="absolute inset-0" onClick={() => setSelectedArticle(null)}></div>
          <div
            className="relative w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden z-10 p-8 md:p-16"
            style={{ backgroundColor: PALETTE.surface, borderWidth: "6px", borderColor: `${PALETTE.border}0D` }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-8 right-8 p-3 rounded-full transition-all hover:rotate-90"
              style={{ backgroundColor: `${PALETTE.border}0D`, color: PALETTE.text }}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-1 rounded-full text-[9px] font-black uppercase"
                  style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
                >
                  {selectedArticle.cat}
                </span>
                <span className="font-mono text-xs font-bold" style={{ color: PALETTE.textMuted }}>
                  {selectedArticle.date}
                </span>
              </div>
              <h2
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none"
                style={{ color: PALETTE.text }}
              >
                {selectedArticle.title}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: PALETTE.textMuted }}>
                {selectedArticle.fullContent}
              </p>
              <div className="pt-6 flex gap-4">
                <BrutalButton variant="black" onClick={() => setSelectedArticle(null)}>
                  Fermer
                </BrutalButton>
                <BrutalButton
                  variant="primary"
                  onClick={() => {
                    setSelectedArticle(null)
                    onNavigate("formations")
                  }}
                >
                  Voir nos formations
                </BrutalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PageLegalDetailed = () => (
  <div
    className="animate-in fade-in duration-1000 text-left pt-48 pb-32 px-6 md:px-12"
    style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}
  >
    <div className="max-w-[1400px] mx-auto text-left">
      <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 text-left">
        LÉGAL
      </h1>
      <div className="grid lg:grid-cols-2 gap-12 text-left">
        <BrutalCard className="p-12" bgColor={PALETTE.surfaceAlt}>
          <div className="flex items-center gap-6 mb-8 text-left">
            <Landmark size={48} color={PALETTE.primary} />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-left" style={{ color: PALETTE.text }}>
              MENTIONS ÉDITEUR
            </h2>
          </div>
          <ul className="space-y-4 font-mono text-sm uppercase text-left">
            <li className="font-black text-left" style={{ color: PALETTE.text }}>
              Raison Sociale :{" "}
              <span className="font-normal" style={{ color: PALETTE.textMuted }}>
                NOMA FORMATION SAS
              </span>
            </li>
            <li className="font-black text-left" style={{ color: PALETTE.text }}>
              SIRET :{" "}
              <span className="font-normal" style={{ color: PALETTE.textMuted }}>
                993 073 139 00012
              </span>
            </li>
            <li className="font-black text-left" style={{ color: PALETTE.text }}>
              Siège :{" "}
              <span className="font-normal" style={{ color: PALETTE.textMuted }}>
                59 RUE DE PONTHIEU, PARIS
              </span>
            </li>
            <li className="font-black text-left" style={{ color: PALETTE.text }}>
              Direction :{" "}
              <span className="font-normal" style={{ color: PALETTE.textMuted }}>
                Jules Morel
              </span>
            </li>
          </ul>
        </BrutalCard>
        <BrutalCard className="p-12" bgColor={PALETTE.cardBlue}>
          <div className="flex items-center gap-6 mb-8 text-left">
            <ShieldCheck size={48} color={PALETTE.border} />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-left" style={{ color: PALETTE.text }}>
              QUALIOPI
            </h2>
          </div>
          <p className="text-lg font-bold italic mb-6 text-left" style={{ color: PALETTE.text }}>
            {"Certification délivrée au titre de la catégorie d'actions : Actions de Formation Professionnelle."}
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {["Information Public", "Moyens Techniques", "Accompagnement", "Amélioration Continue"].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase text-left"
                style={{
                  backgroundColor: `${PALETTE.surface}66`,
                  borderWidth: "1px",
                  borderColor: `${PALETTE.border}0D`,
                  color: PALETTE.text,
                }}
              >
                <Check size={14} /> {item}
              </div>
            ))}
          </div>
        </BrutalCard>
        <BrutalCard className="p-12" bgColor={PALETTE.secondarySoft}>
          <div className="flex items-center gap-6 mb-8 text-left">
            <Accessibility size={48} color={PALETTE.text} />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-left" style={{ color: PALETTE.text }}>
              HANDICAP & ACCÈS
            </h2>
          </div>
          <p className="text-sm font-medium leading-relaxed mb-8 text-left" style={{ color: PALETTE.textMuted }}>
            Conforme Loi n° 2005-102. Nos parcours e-learning respectent les normes d'accessibilité.
          </p>
          <div
            className="p-8 rounded-[30px] shadow-xl text-left"
            style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
          >
            <h4 className="text-xs font-black uppercase mb-2" style={{ color: `${PALETTE.primaryContrast}80` }}>
              Référent Handicap
            </h4>
            <p className="text-xl font-bold uppercase">Jules Morel</p>
            <p className="text-sm font-mono mt-2 block">handicap@noma-formation.fr</p>
          </div>
        </BrutalCard>
        <BrutalCard className="p-12" bgColor={PALETTE.cardNeutral}>
          <div className="flex items-center gap-6 mb-8 text-left">
            <Monitor size={48} color={PALETTE.text} />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-left" style={{ color: PALETTE.text }}>
              CADRE E-LEARNING
            </h2>
          </div>
          <ul className="space-y-4 text-left">
            <li className="flex gap-4 items-start" style={{ color: PALETTE.text }}>
              <Headphones size={20} className="shrink-0" />{" "}
              <span className="text-xs font-black uppercase text-left">Assistance technique sous 24h</span>
            </li>
            <li className="flex gap-4 items-start" style={{ color: PALETTE.text }}>
              <UserCheck size={20} className="shrink-0" />{" "}
              <span className="text-xs font-black uppercase text-left">Accompagnement par mentors certifiés</span>
            </li>
            <li className="flex gap-4 items-start" style={{ color: PALETTE.text }}>
              <ShieldAlert size={20} className="shrink-0" />{" "}
              <span className="text-xs font-black uppercase text-left">Conformité FOAD Décret n° 2018-1341</span>
            </li>
          </ul>
        </BrutalCard>
      </div>
    </div>
  </div>
)

// --- 5. APP ROOT ---
export default function App() {
  const [page, setPage] = useState("home")
  const [selectedFormation, setSelectedFormation] = useState<CourseType | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string
    date: string
    cat: string
    desc: string
    color: string
    fullContent: string
  } | null>(null)

  const naviguer = (p: string) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cursus: CourseType[] = [
    {
      title: "Architecte Deep Learning",
      cat: "EXPERT",
      duration: "40h",
      level: "Expert",
      price: "1490€",
      color: PALETTE.surfaceAlt,
      icon: BrainCircuit,
      longDesc: "Maîtrise des architectures neuronales et pipelines RAG complexes.",
    },
    {
      title: "Design de Prompt Stratégique",
      cat: "BUSINESS",
      duration: "12h",
      level: "Débutant/Pro",
      price: "490€",
      color: PALETTE.cardBlue,
      icon: Zap,
      longDesc: "Instructions IA de haute précision pour objectifs métier.",
    },
    {
      title: "Workflows IA Opérationnels",
      cat: "TECH",
      duration: "32h",
      level: "Intermédiaire",
      price: "990€",
      color: PALETTE.cardNeutral,
      icon: Cpu,
      longDesc: "Automatisation de bout en bout via Python et orchestrateurs.",
    },
    {
      title: "Design Produit Meta-IA",
      cat: "PRODUIT",
      duration: "24H",
      level: "Intermédiaire",
      price: "790€",
      color: PALETTE.secondarySoft,
      icon: Globe,
      longDesc: "Interfaces utilisateur assistées par agents autonomes.",
    },
  ]

  const FormationModal = ({ formation, onClose }: { formation: CourseType; onClose: () => void }) => {
    const IconComp = formation.icon
    return (
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in duration-300"
        style={{ backgroundColor: `${PALETTE.border}E6` }}
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        <div
          className="relative w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden z-10 p-8 md:p-16"
          style={{ backgroundColor: PALETTE.surface, borderWidth: "6px", borderColor: `${PALETTE.border}0D` }}
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full transition-all hover:rotate-90"
            style={{ backgroundColor: `${PALETTE.border}0D`, color: PALETTE.text }}
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-left" style={{ color: PALETTE.text }}>
                <div
                  className="p-4 rounded-2xl shadow-inner"
                  style={{
                    backgroundColor: PALETTE.surfaceAlt,
                    borderWidth: "1px",
                    borderColor: `${PALETTE.border}0D`,
                  }}
                >
                  {IconComp && <IconComp size={40} strokeWidth={1.5} color={PALETTE.primary} />}
                </div>
                <span
                  className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full"
                  style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
                >
                  FORMATION
                </span>
              </div>
              <h2
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
                style={{ color: PALETTE.text }}
              >
                {formation.title}
              </h2>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {[
                { icon: Timer, label: "Durée", val: formation.duration },
                { icon: Target, label: "Niveau", val: formation.level },
                { icon: Award, label: "Certification", val: "NOMA / Qualiopi" },
                { icon: Disc, label: "Accès", val: "À vie" },
              ].map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <div
                    key={i}
                    className="p-5 rounded-3xl flex flex-col gap-2"
                    style={{
                      backgroundColor: PALETTE.surfaceAlt,
                      borderWidth: "1px",
                      borderColor: `${PALETTE.border}0D`,
                    }}
                  >
                    <StatIcon size={20} strokeWidth={1.5} color={PALETTE.primary} />
                    <div>
                      <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: PALETTE.textMuted }}
                      >
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold leading-none" style={{ color: PALETTE.text }}>
                        {stat.val}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p
              className="text-xl md:text-2xl font-bold leading-tight italic pl-8 text-left"
              style={{ borderLeftWidth: "12px", borderLeftColor: PALETTE.primary, color: PALETTE.text }}
            >
              {formation.longDesc}
            </p>
            <footer className="grid md:grid-cols-2 gap-4 pt-6">
              <BrutalButton
                variant="white"
                className="w-full !py-6 uppercase"
                onClick={() =>
                  (window.location.href =
                    "mailto:contact@noma-formation.fr?subject=Demande de programme - " + formation.title)
                }
              >
                Demander le programme
              </BrutalButton>
              <BrutalButton
                variant="primary"
                className="w-full !py-6 uppercase text-center"
                onClick={() => {
                  onClose()
                  naviguer("formations")
                }}
              >
                {"S'inscrire maintenant"}
              </BrutalButton>
            </footer>
          </div>
        </div>
      </div>
    )
  }

  const ArticleModal = ({
    article,
    onClose,
  }: {
    article: { title: string; date: string; cat: string; desc: string; color: string; fullContent: string }
    onClose: () => void
  }) => (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in duration-300"
      style={{ backgroundColor: `${PALETTE.border}E6` }}
    >
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        className="relative w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden z-10 p-8 md:p-16"
        style={{ backgroundColor: PALETTE.surface, borderWidth: "6px", borderColor: `${PALETTE.border}0D` }}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full transition-all hover:rotate-90"
          style={{ backgroundColor: `${PALETTE.border}0D`, color: PALETTE.text }}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span
              className="px-4 py-1 rounded-full text-[9px] font-black uppercase"
              style={{ backgroundColor: PALETTE.border, color: PALETTE.primaryContrast }}
            >
              {article.cat}
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: PALETTE.textMuted }}>
              {article.date}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none"
            style={{ color: PALETTE.text }}
          >
            {article.title}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: PALETTE.textMuted }}>
            {article.fullContent}
          </p>
          <div className="pt-6 flex gap-4">
            <BrutalButton variant="black" onClick={onClose}>
              Fermer
            </BrutalButton>
            <BrutalButton
              variant="primary"
              onClick={() => {
                onClose()
                naviguer("formations")
              }}
            >
              Voir nos formations
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className="antialiased selection:text-white text-left"
      style={{ backgroundColor: PALETTE.bg, color: PALETTE.text, selectionBackgroundColor: PALETTE.primary }}
    >
      {/* Content wrapper */}
      <div className="relative">
        <nav
          className="fixed top-0 w-full z-[100] px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-md font-mono"
          style={{
            backgroundColor: `${PALETTE.surface}F2`,
            borderBottomWidth: "2.5px",
            borderBottomColor: PALETTE.border,
          }}
        >
          <div className="flex items-center gap-10">
            <div className="cursor-pointer group" onClick={() => naviguer("home")}>
              <BrandLogo />
            </div>
            <div
              className="hidden lg:flex items-center gap-10 text-[15px] font-black uppercase"
              style={{ color: PALETTE.text }}
            >
              <button
                onClick={() => naviguer("home")}
                style={{ color: page === "home" ? PALETTE.primary : PALETTE.text }}
                className={page !== "home" ? "hover:opacity-60" : ""}
              >
                ACCUEIL
              </button>
              <button
                onClick={() => naviguer("formations")}
                style={{ color: page === "formations" ? PALETTE.primary : PALETTE.text }}
                className={page !== "formations" ? "hover:opacity-60" : ""}
              >
                FORMATIONS
              </button>
              <button
                onClick={() => naviguer("actualites")}
                style={{ color: page === "actualites" ? PALETTE.primary : PALETTE.text }}
                className={page !== "actualites" ? "hover:opacity-60" : ""}
              >
                ACTUALITÉ
              </button>
              <button
                onClick={() => naviguer("legal")}
                style={{ color: page === "legal" ? PALETTE.primary : PALETTE.text }}
                className={page !== "legal" ? "hover:opacity-60" : ""}
              >
                LÉGAL
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (page !== "home") naviguer("home")
                setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), 100)
              }}
              className="text-[12px] font-black uppercase"
              style={{ color: PALETTE.text }}
            >
              FAQ
            </button>
            <BrutalButton onClick={() => naviguer("formations")} className="!py-3 !text-[10px]">
              CHOISIR MA FORMATION
            </BrutalButton>
          </div>
        </nav>

        <main>
          {page === "home" && (
            <div className="animate-in fade-in duration-1000 text-left">
              <SectionHero onNavigate={naviguer} />
              <SectionCibles onNavigate={naviguer} />
              <SectionCatalogue courses={cursus} onSelect={setSelectedFormation} onNavigate={naviguer} />
              <SectionProofs />
              <SectionQuizOrientation />
              <SectionWorkflow />
              <SectionFinancing onNavigate={naviguer} />
              <SectionFAQ />
              <SectionClosing onNavigate={naviguer} />
            </div>
          )}

          {page === "formations" && (
            <div className="animate-in fade-in duration-1000 text-left pt-48" style={{ color: PALETTE.text }}>
              <section
                className="pb-16 px-6 md:px-12"
                style={{ backgroundColor: PALETTE.bg, borderBottomWidth: "2.5px", borderBottomColor: PALETTE.border }}
              >
                <div className="max-w-[1400px] mx-auto text-left" style={{ color: PALETTE.text }}>
                  <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-6 text-left">
                    CATALOGUE
                  </h1>
                  <p className="text-xl font-bold max-w-2xl italic text-left" style={{ color: PALETTE.textMuted }}>
                    {"Nos cursus d'excellence conçus pour propulser votre carrière dans l'IA."}
                  </p>
                </div>
              </section>
              <SectionCatalogue courses={cursus} onSelect={setSelectedFormation} onNavigate={naviguer} />
              <SectionFinancing onNavigate={naviguer} />
            </div>
          )}

          {page === "actualites" && <PageActualitesIA onNavigate={naviguer} />}
          {page === "legal" && <PageLegalDetailed />}
        </main>

        {selectedFormation && (
          <FormationModal formation={selectedFormation} onClose={() => setSelectedFormation(null)} />
        )}
        {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

        <footer
          className="px-6 md:px-12 py-32 text-left"
          style={{
            backgroundColor: PALETTE.surface,
            color: PALETTE.text,
            borderTopWidth: "2.5px",
            borderTopColor: PALETTE.border,
          }}
        >
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-16 text-left">
            <div className="md:col-span-4 text-left">
              <div className="cursor-pointer" onClick={() => naviguer("home")}>
                <BrandLogo className="mb-10 text-left" />
              </div>
              <p
                className="text-sm font-medium max-w-sm mb-12 leading-relaxed uppercase tracking-widest font-bold italic text-left"
                style={{ color: PALETTE.textMuted }}
              >
                {
                  "Architecture de compétences IA de référence. Nous façonnons le futur des compétences professionnelles."
                }
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => naviguer("formations")}
                  className="text-xs font-black uppercase underline underline-offset-4"
                  style={{ color: PALETTE.text }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.text)}
                >
                  Formations
                </button>
                <button
                  onClick={() => naviguer("actualites")}
                  className="text-xs font-black uppercase underline underline-offset-4"
                  style={{ color: PALETTE.text }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.text)}
                >
                  Actualités
                </button>
                <button
                  onClick={() => naviguer("legal")}
                  className="text-xs font-black uppercase underline underline-offset-4"
                  style={{ color: PALETTE.text }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.text)}
                >
                  Légal
                </button>
              </div>
            </div>
            <div className="md:col-span-4 font-mono uppercase text-left">
              <h4 className="text-xs font-black mb-6 tracking-widest" style={{ color: PALETTE.text }}>
                Contact
              </h4>
              <a
                href="mailto:contact@noma-formation.fr"
                className="text-lg font-bold transition-all"
                style={{ color: PALETTE.text }}
                onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.text)}
              >
                contact@noma-formation.fr
              </a>
              <p className="text-sm mt-4" style={{ color: PALETTE.textMuted }}>
                59 Rue de Ponthieu, 75008 Paris
              </p>
            </div>
            <div className="md:col-span-4 text-left">
              <BrutalCard
                className="p-8 text-center cursor-pointer"
                bgColor={PALETTE.cardBlue}
                isHoverable
                onClick={() => naviguer("legal")}
              >
                <ShieldCheck size={48} className="mx-auto mb-4" style={{ color: PALETTE.primary }} />
                <h4 className="text-2xl font-black uppercase leading-none text-center" style={{ color: PALETTE.text }}>
                  QUALIOPI
                </h4>
                <span
                  className="text-[10px] font-black uppercase block mt-2 text-center"
                  style={{ color: PALETTE.textMuted }}
                >
                  Certifié Qualité
                </span>
              </BrutalCard>
            </div>
          </div>
          <div
            className="max-w-[1400px] mx-auto mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-left"
            style={{ borderTopWidth: "1px", borderTopColor: `${PALETTE.border}1A` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PALETTE.textMuted }}>
              © {new Date().getFullYear()} NOMA FORMATION SAS. Tous droits réservés.
            </p>
            <div
              className="flex gap-6 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: PALETTE.textMuted }}
            >
              <button
                onClick={() => naviguer("legal")}
                onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.textMuted)}
              >
                Mentions Légales
              </button>
              <button
                onClick={() => naviguer("legal")}
                onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.textMuted)}
              >
                CGV
              </button>
              <button
                onClick={() => naviguer("legal")}
                onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.textMuted)}
              >
                Politique de Confidentialité
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

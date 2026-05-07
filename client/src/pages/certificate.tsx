import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Award } from "lucide-react";
import { useRef } from "react";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const LEVEL_COLORS: Record<string, { from: string; to: string; badge: string; accent: string }> = {
  beginner:     { from: "#22c55e", to: "#16a34a", badge: "#dcfce7", accent: "#15803d" },
  intermediate: { from: "#3b82f6", to: "#1d4ed8", badge: "#dbeafe", accent: "#1e40af" },
  advanced:     { from: "#8b5cf6", to: "#6d28d9", badge: "#ede9fe", accent: "#5b21b6" },
  expert:       { from: "#f59e0b", to: "#b45309", badge: "#fef3c7", accent: "#92400e" },
};

export default function Certificate() {
  const { level } = useParams<{ level: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const certRef = useRef<HTMLDivElement>(null);

  const levelKey = (level || "beginner").toLowerCase();
  const levelLabel = LEVEL_LABELS[levelKey] || "Beginner";
  const colors = LEVEL_COLORS[levelKey] || LEVEL_COLORS.beginner;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${levelLabel} JavaScript Certificate`,
        text: `I just completed the ${levelLabel} JavaScript course on CodeSteps!`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 print:bg-white">
      {/* Top bar - hidden during print */}
      <div className="print:hidden px-4 py-3 flex items-center justify-between border-b bg-card">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/course")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download / Print
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <div className="flex items-center justify-center p-6 print:p-0">
        <div
          ref={certRef}
          className="w-full max-w-3xl print:max-w-none bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {/* Top gradient bar */}
          <div style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, height: 12 }} />

          <div className="p-10 sm:p-16 relative">
            {/* Watermark lines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${colors.from} 0, ${colors.from} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "24px 24px",
            }} />

            {/* Logo / Header */}
            <div className="flex flex-col items-center mb-8 relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                <span className="text-white font-bold text-xl" style={{ fontFamily: "monospace" }}>&lt;/&gt;</span>
              </div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>
                CodeSteps
              </p>
              <p className="text-xs tracking-widest text-gray-400 uppercase mt-0.5">AI-Powered Programming Learning</p>
            </div>

            {/* Certificate title */}
            <div className="text-center mb-8 relative">
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Certificate of Completion</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight mb-1">
                This certifies that
              </h1>
            </div>

            {/* Name */}
            <div className="text-center mb-8 relative">
              <div className="inline-block border-b-2 pb-2 px-8" style={{ borderColor: colors.from }}>
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: colors.accent }}>
                  {user?.username || "Student"}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="text-center mb-8 relative">
              <p className="text-gray-600 text-lg leading-relaxed">
                has successfully completed all <strong>20 lessons</strong> of the
              </p>
              <div className="inline-flex items-center gap-3 mt-3 px-6 py-3 rounded-full" style={{ background: colors.badge }}>
                <Award className="h-6 w-6" style={{ color: colors.accent }} />
                <span className="text-xl font-bold" style={{ color: colors.accent }}>
                  {levelLabel} JavaScript Course
                </span>
              </div>
              <p className="text-gray-600 mt-4 text-base leading-relaxed max-w-md mx-auto">
                demonstrating proficiency in {levelLabel.toLowerCase()}-level JavaScript programming concepts through
                interactive lessons and practical exercises.
              </p>
            </div>

            {/* Date & Signature row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-12 pt-8 border-t border-gray-100 relative">
              <div className="text-center">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Date Issued</p>
                <p className="text-gray-700 font-semibold">{today}</p>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: colors.badge }}>
                <Award className="h-8 w-8" style={{ color: colors.accent }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: colors.accent }}>{levelLabel} Level</p>
                  <p className="text-xs text-gray-500">20 / 20 Lessons</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-28 border-b border-gray-400 mb-1" />
                <p className="text-xs tracking-widest uppercase text-gray-400">CodeSteps Platform</p>
                <p className="text-xs text-gray-500 mt-0.5">AI Tutor Verified</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="text-center mt-6 relative">
              <p className="text-[10px] text-gray-300 tracking-widest uppercase">
                Certificate ID: CS-{levelKey.toUpperCase()}-{user?.id?.slice(0, 8).toUpperCase() || "XXXXXXXX"}
              </p>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, height: 12 }} />
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:p-0, .print\\:p-0 * { visibility: visible; }
          [ref="certRef"], [ref="certRef"] * { visibility: visible; }
          body { margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
}

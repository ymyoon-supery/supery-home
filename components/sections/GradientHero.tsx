import Image from "next/image";

export default function GradientHero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Static CSS gradient — replaces animated blobs, zero JS */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(124,58,237,0.45), transparent)",
            "radial-gradient(ellipse 65% 55% at 100% 5%, rgba(37,99,235,0.40), transparent)",
            "radial-gradient(ellipse 65% 55% at 40% 110%, rgba(8,145,178,0.45), transparent)",
          ].join(", "),
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <Image
          src="https://res.cloudinary.com/deitwd6wh/image/upload/v1775807828/Logo_white_dia_wfd3jw.png"
          alt="SUPER Y"
          width={480}
          height={120}
          className="mx-auto w-44 md:w-[268px] lg:w-[336px] h-auto object-contain mb-8"
          priority
        />
        <p className="text-xs font-semibold tracking-[0.4em] text-white/40 uppercase mb-6">
          Marketing Agency
        </p>
        <p className="text-white/50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
          GOOD IDEA는 좋은 인사이트에서 출발합니다.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  );
}

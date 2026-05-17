import Image from "next/image";

export default function GoNaturalBrandMark() {
  return (
    <div className="mt-3 w-full max-w-[min(72vw,320px)]">
      <Image
        src="/assets/images/logo/LOGO-GONATURAL.png"
        alt="Go Natural"
        width={640}
        height={256}
        priority
        draggable={false}
        className="h-auto w-full object-contain object-left drop-shadow-[0_8px_28px_rgba(46,74,54,0.1)]"
      />
      <p
        aria-hidden
        className="mt-2 w-full text-center font-tan-nimbus text-[clamp(1.35rem,3.8vw,1.85rem)] font-normal uppercase leading-none tracking-[0.06em] text-[#2E4A36]"
      >
        GO NATURAL
      </p>
    </div>
  );
}

import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ className = "h-10 w-10", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/images/nuoi-em-logo.png"
      alt="Logo Nuôi Em"
      width={768}
      height={768}
      priority={priority}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}

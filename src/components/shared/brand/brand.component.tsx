import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export const Brand = () => {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
    >
      <span className="relative block size-8 shrink-0 md:size-9">
        <Image
          src="/assets/devcosmo/brand/orbit-symbol-transparent.png"
          alt=""
          width={1254}
          height={1254}
          sizes="36px"
          className="h-full w-full object-contain light:hidden"
        />
        <Image
          src="/assets/devcosmo/brand/orbit-symbol-light-surface.png"
          alt=""
          width={1254}
          height={1254}
          sizes="36px"
          className="hidden h-full w-full object-contain light:block"
        />
      </span>
      <span className="text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-text-primary md:text-[11px]">
        DEV COSMO LAB
      </span>
    </Link>
  );
};

import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export const Brand = () => {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
    >
      <span className="relative block h-9 w-12 shrink-0 md:h-10 md:w-[54px]">
        <Image
          src="/assets/brand/dev-cosmo-lab-logo-on-dark.png"
          alt=""
          width={430}
          height={319}
          sizes="54px"
          className="h-full w-full object-contain light:hidden"
        />
        <Image
          src="/assets/brand/dev-cosmo-lab-logo-on-light.png"
          alt=""
          width={430}
          height={319}
          sizes="54px"
          className="hidden h-full w-full object-contain light:block"
        />
      </span>
      <span className="text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-text-primary md:text-xs">
        DEV COSMO LAB
      </span>
    </Link>
  );
};

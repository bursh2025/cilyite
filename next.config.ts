import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string) {
  return {
    ...(phase !== PHASE_DEVELOPMENT_SERVER ? { output: 'export' as const } : {}),
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
    trailingSlash: true,
    images: { unoptimized: true },
    devIndicators: false as const,
  };
}

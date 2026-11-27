import { withBasePath } from '../lib/site-path';
const heights = {'office-panorama': 400, 'building-collage': 800, 'siluet-collage-v1': 800, 'kulman-collage-v2': 800, 'district-sunlight': 480};

export default function EditorialImage({name, alt, sizes, priority = false}: {
  name: keyof typeof heights; alt: string; sizes: string; priority?: boolean;
}) {
  const base = withBasePath('/media/editorial/' + name);
  return <img src={base + '-1200.webp'} alt={alt} width="1200" height={heights[name]}
    srcSet={[720, 1200, 1800].map(w => base + '-' + w + '.webp ' + w + 'w').join(', ')}
    sizes={sizes} loading={priority || name === 'office-panorama' ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />;
}

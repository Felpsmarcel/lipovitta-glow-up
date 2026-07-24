import type { ImgHTMLAttributes } from "react";

/**
 * Shape produced by vite-imagetools with `?as=picture&format=avif;webp;<orig>&w=...`.
 * `sources` is keyed by MIME subtype (avif, webp, png, jpg) and value is a full srcset string.
 */
export type PictureSource = {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height"> & {
  picture: PictureSource;
  sizes?: string;
  alt: string;
  /** Optional override for width/height on the fallback img (defaults to imagetools output). */
  width?: number;
  height?: number;
};

/**
 * Renders AVIF → WebP → fallback with responsive srcset.
 * Pass the object imported via `?as=picture` as `picture`.
 */
export const ResponsiveImage = ({ picture, sizes, alt, width, height, ...imgProps }: Props) => {
  const { sources, img } = picture;
  // Render AVIF first (best compression), then WebP, then original fallback via <img>.
  const orderedTypes = Object.keys(sources).sort((a, b) => {
    const rank = (t: string) => (t === "avif" ? 0 : t === "webp" ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <picture>
      {orderedTypes
        .filter((type) => type === "avif" || type === "webp")
        .map((type) => (
          <source key={type} type={`image/${type}`} srcSet={sources[type]} sizes={sizes} />
        ))}
      <img
        src={img.src}
        width={width ?? img.w}
        height={height ?? img.h}
        alt={alt}
        decoding="async"
        {...imgProps}
      />
    </picture>
  );
};

export default ResponsiveImage;

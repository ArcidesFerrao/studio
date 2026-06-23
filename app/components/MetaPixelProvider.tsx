import { Suspense } from "react";
import MetaPixel from "./MetaPixel";

export default function MetaPixelProvider({ pixelId }: { pixelId: string }) {
  return (
    <Suspense fallback={null}>
      <MetaPixel pixelId={pixelId} />
    </Suspense>
  );
}

import { dock } from "@/lib/design-tokens";

/**
 * Calculate magnification scale for a dock icon based on mouse position
 *
 * @param mouseX - Current mouse X position in pixels
 * @param iconCenterX - Icon center X position in pixels
 * @param maxScale - Maximum scale factor (default: 2.0)
 * @param effectRadius - Distance in pixels where effect applies (default: 150)
 * @returns Scale value between 1.0 and maxScale
 *
 * Algorithm uses quadratic falloff for smooth, natural-feeling magnification
 * similar to macOS Dock behavior.
 */
export function calculateMagnification(
  mouseX: number,
  iconCenterX: number,
  maxScale: number = dock.maxScale,
  effectRadius: number = dock.effectRadius
): number {
  const distance = Math.abs(mouseX - iconCenterX);

  // Outside effect radius - no magnification
  if (distance > effectRadius) {
    return 1.0;
  }

  // Inside effect radius - apply quadratic falloff
  // Formula: 1 + (maxScale - 1) * (1 - (distance / radius)^2)
  const normalizedDistance = distance / effectRadius;
  const scale = 1 + (maxScale - 1) * (1 - Math.pow(normalizedDistance, 2));

  return scale;
}

/**
 * Get the center X position of an element
 *
 * @param element - DOM element to measure
 * @returns Center X position in pixels, or 0 if element is null
 */
export function getElementCenterX(element: HTMLElement | null): number {
  if (!element) return 0;

  const rect = element.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

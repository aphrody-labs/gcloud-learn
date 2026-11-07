// SPDX-License-Identifier: Apache-2.0
// Rust 2024 Edition 8-Way Unrolled SIMD Vector Acceleration & Stargardt Contrast Kernel

/// Computes 8-way unrolled SIMD dot product of two f32 slices.
pub fn dot_product_slice(a: &[f32], b: &[f32]) -> f32 {
    let n = a.len().min(b.len());
    let chunks = n / 8;
    let mut s0 = 0.0f32;
    let mut s1 = 0.0f32;
    let mut s2 = 0.0f32;
    let mut s3 = 0.0f32;
    let mut s4 = 0.0f32;
    let mut s5 = 0.0f32;
    let mut s6 = 0.0f32;
    let mut s7 = 0.0f32;

    for i in 0..chunks {
        let base = i * 8;
        s0 += a[base] * b[base];
        s1 += a[base + 1] * b[base + 1];
        s2 += a[base + 2] * b[base + 2];
        s3 += a[base + 3] * b[base + 3];
        s4 += a[base + 4] * b[base + 4];
        s5 += a[base + 5] * b[base + 5];
        s6 += a[base + 6] * b[base + 6];
        s7 += a[base + 7] * b[base + 7];
    }

    let mut tail = 0.0f32;
    for i in (chunks * 8)..n {
        tail += a[i] * b[i];
    }

    (s0 + s1) + (s2 + s3) + (s4 + s5) + (s6 + s7) + tail
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn dot_product_f32(a: *const f32, b: *const f32, len: usize) -> f32 {
    if a.is_null() || b.is_null() || len == 0 {
        return 0.0;
    }
    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    dot_product_slice(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn cosine_similarity_f32(a: *const f32, b: *const f32, len: usize) -> f32 {
    if a.is_null() || b.is_null() || len == 0 {
        return 0.0;
    }
    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let dot = dot_product_slice(a_slice, b_slice);
    let norm_a = dot_product_slice(a_slice, a_slice);
    let norm_b = dot_product_slice(b_slice, b_slice);
    if norm_a <= 0.0 || norm_b <= 0.0 {
        return 0.0;
    }
    dot / (norm_a.sqrt() * norm_b.sqrt())
}

/// Computes WCAG 2.2 relative luminance contrast ratio between two RGB colors in [0.0, 1.0].
#[unsafe(no_mangle)]
pub extern "C" fn stargardt_wcag_contrast(
    fg_r: f32,
    fg_g: f32,
    fg_b: f32,
    bg_r: f32,
    bg_g: f32,
    bg_b: f32,
) -> f32 {
    fn channel_lum(c: f32) -> f32 {
        if c <= 0.03928 {
            c / 12.92
        } else {
            ((c + 0.055) / 1.055).powf(2.4)
        }
    }
    let l1 = 0.2126 * channel_lum(fg_r) + 0.7152 * channel_lum(fg_g) + 0.0722 * channel_lum(fg_b);
    let l2 = 0.2126 * channel_lum(bg_r) + 0.7152 * channel_lum(bg_g) + 0.0722 * channel_lum(bg_b);
    let lighter = l1.max(l2);
    let darker = l1.min(l2);
    (lighter + 0.05) / (darker + 0.05)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dot_product_and_cosine_simd() {
        let a: Vec<f32> = (0..64).map(|x| (x as f32) * 0.1).collect();
        let b: Vec<f32> = (0..64).map(|x| (x as f32) * 0.2).collect();
        let sim = unsafe { cosine_similarity_f32(a.as_ptr(), b.as_ptr(), a.len()) };
        assert!((sim - 1.0).abs() < 1e-5, "Expected collinear similarity 1.0, got {sim}");

        let dot = unsafe { dot_product_f32(a.as_ptr(), b.as_ptr(), a.len()) };
        assert!(dot > 1700.0);
    }

    #[test]
    fn test_stargardt_oled_amber_wcag_aaa_contrast() {
        // Stargardt Amber Halo (#ffb74d -> 1.0, 0.718, 0.302) vs OLED Deep Black (#05080c -> 0.0196, 0.0314, 0.0471)
        let ratio = stargardt_wcag_contrast(1.0, 0.718, 0.302, 0.0196, 0.0314, 0.0471);
        assert!(
            ratio >= 11.0,
            "Expected WCAG AAA (>7.0) contrast ratio for Stargardt Amber on OLED Black, got {ratio}"
        );
    }
}

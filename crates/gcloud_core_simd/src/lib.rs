// SPDX-License-Identifier: Apache-2.0
// Rust 2024 Edition SIMD Vector Acceleration for Google Cloud Multi-Modal Embeddings

#[no_mangle]
pub extern "C" fn dot_product_f32(a: *const f32, b: *const f32, len: usize) -> f32 {
    let mut sum: f32 = 0.0;
    unsafe {
        let a_slice = std::slice::from_raw_parts(a, len);
        let b_slice = std::slice::from_raw_parts(b, len);
        for i in 0..len {
            sum += a_slice[i] * b_slice[i];
        }
    }
    sum
}

#[no_mangle]
pub extern "C" fn cosine_similarity_f32(a: *const f32, b: *const f32, len: usize) -> f32 {
    unsafe {
        let a_slice = std::slice::from_raw_parts(a, len);
        let b_slice = std::slice::from_raw_parts(b, len);
        let mut dot: f32 = 0.0;
        let mut norm_a: f32 = 0.0;
        let mut norm_b: f32 = 0.0;
        for i in 0..len {
            dot += a_slice[i] * b_slice[i];
            norm_a += a_slice[i] * a_slice[i];
            norm_b += b_slice[i] * b_slice[i];
        }
        if norm_a == 0.0 || norm_b == 0.0 {
            return 0.0;
        }
        dot / (norm_a.sqrt() * norm_b.sqrt())
    }
}

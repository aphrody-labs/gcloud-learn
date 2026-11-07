// SPDX-License-Identifier: Apache-2.0
// Rust 2024 WebAssembly Kernel for Cloudflare Edge & WebGPU 3D Cloud Simulation

/// Computes Stargardt scotoma radial compensation factor in [0.0, 1.0].
#[unsafe(no_mangle)]
pub extern "C" fn wasm_scotoma_compensation(uv_x: f32, uv_y: f32, zoom: f32) -> f32 {
    let dx = (uv_x - 0.5) * zoom;
    let dy = (uv_y - 0.5) * zoom;
    let dist = (dx * dx + dy * dy).sqrt();
    let edge0 = 0.08f32;
    let edge1 = 0.35f32;
    let t = ((dist - edge0) / (edge1 - edge0)).clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

/// Computes europe-west9 tri-zone SLA availability score (basis points out of 10000).
#[unsafe(no_mangle)]
pub extern "C" fn wasm_tri_zone_sla_bps(active_zones: u32, kms_hsm_ready: u32) -> u32 {
    let base = match active_zones {
        0 => 0,
        1 => 9900,
        2 => 9990,
        _ => 9999,
    };
    if kms_hsm_ready > 0 && base > 0 {
        base + 1
    } else {
        base
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_scotoma_compensation_bounds() {
        let center = wasm_scotoma_compensation(0.5, 0.5, 1.85);
        let far = wasm_scotoma_compensation(1.0, 1.0, 1.85);
        assert_eq!(center, 0.0);
        assert_eq!(far, 1.0);
    }

    #[test]
    fn test_tri_zone_sla_bps() {
        assert_eq!(wasm_tri_zone_sla_bps(3, 1), 10000);
        assert_eq!(wasm_tri_zone_sla_bps(2, 0), 9990);
    }
}

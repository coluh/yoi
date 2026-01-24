/**
 * 生成标准正态分布随机数（均值0，标准差1）
 * 使用Box-Muller变换
 */
export function randomGaussian() {
  let u = 0,
    v = 0;
  // 确保 u, v 在 (0,1] 区间内
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);

  return { z0, z1 }; // 返回两个独立的正态分布随机数
}

// 生成单个标准正态分布值
export function randomGaussianSingle() {
  const u = 1 - Math.random(); // (0,1] 保证对数安全
  const v = Math.random();

  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

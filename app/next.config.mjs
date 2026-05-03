/** @type {import('next').NextConfig} */
const nextConfig = {
  // dev 下关闭 StrictMode 双调 useEffect —— 流式 fetch 跑两次不优雅
  // prod 不受影响
  reactStrictMode: false,
};

export default nextConfig;

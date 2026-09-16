/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // generates static HTML/CSS/JS in /out folder
  trailingSlash: true,     // needed for shared hosting (e.g. cPanel, Netlify)
  reactCompiler: true,
};

export default nextConfig;

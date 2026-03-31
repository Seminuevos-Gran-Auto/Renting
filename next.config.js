/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
};

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

module.exports = {
    ...nextConfig,
    basePath: isGithubPages ? '/Renting' : '',
    env: {
        NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/Renting' : '',
    },
};

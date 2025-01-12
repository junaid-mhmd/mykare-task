import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Mykare task",
		short_name: "Mykare",
		description: "A Progressive Web App built with Next.js",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		screenshots: [
			{
				src: "web.png",
				sizes: "1920x1080",
				type: "image/png",
				form_factor: "wide",
			},
			{
				src: "mobile.png",
				sizes: "1080x1920",
				type: "image/png",
			},
		],
		icons: [
			{
				src: "/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}

import React, { useMemo } from "react";
import { useWidget } from "../../../utils/eventhooks";
import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import { KnownComponent } from "../../../utils/registry/types";
import { useAsyncMemo } from "../../../hooks/useasyncmemo";
import styles from "./website_linkage.module.css";


enum SiteType {
	SEARCH = "search",
	URL = "url"
}

type TopSite = {
	favicon: string | null;
	title: string;
	abbr?: string;
	type: SiteType;
	url: string;
}

const getTopSites = async (limit: number = 12): Promise<TopSite[]> => {
	// @ts-ignore
	if (!!(window.browser)) {
		// @ts-ignore
		return browser.topSites.get({ newtab: true, includeFavicon: true, limit });
	}

	// Dummy Development Data
	return new Promise((resolve, reject) => resolve([
		{
			"type": SiteType.SEARCH,
			"url": "https://amazon.com",
			"title": "@amazon",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://www.twitch.tv/",
			"title": "Twitch",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://proxer.me/",
			"title": "Startseite - Proxer.Me",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://web.whatsapp.com/",
			"title": "WhatsApp",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://drive.google.com/",
			"title": "drive.google",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://github.com/",
			"title": "GitHub",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://chat.openai.com/",
			"title": "Reciprocal of complex number",
			"favicon": null
		},
		{
			"type": SiteType.URL,
			"url": "https://wakatime.com/",
			"title": "WakaTime - Dashboards for developers",
			"favicon": null
		}
	].splice(0, limit)));
}

function WebsiteLinkage(props: { blur: boolean, id: string }) {
	const widget = useWidget(props.id);
	const topSites = useAsyncMemo(async () => {
		const topSites = (await getTopSites(widget.limit)).map((site: TopSite) => {
			site.abbr = site.url.replace(/http(s|):\/\/(www.*?\.|)/, "");
			return site;
		});

		return topSites;
	}, [widget.limit], []);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div className={`${styles.container} widget`}>
				{topSites.map((site, idx) => (
					<a
						className={styles.site}
						key={idx}
						href={site.url}
						title={site.title}
					>
						{site.favicon === null ? (
							<FallbackImage letter={site.abbr![0]} />
						) : (
							<img src={site.favicon} alt={site.title} />
						)}
					</a>
				))}
			</div>
		</WidgetMoverWrapper>
	);
}

const FallbackImage = (props: { letter: string }) => {
	const bgColor = useMemo(() => {
		const ord = props.letter.toLowerCase().charCodeAt(0) - 96;

		const hue = ((ord - 1) / 26) * 360;
		const saturation = 50;
		const lightness = 50;

		return `hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`;
	}, [props.letter]);

	return (
		<svg width="100%" height="100%" viewBox="0 0 100 100">
			<rect height="100%" width="100%" fill={bgColor} />
			<text
				x="50%"
				y="50%"
				fontStyle="normal"
				fontWeight="bold"
				fill="#FFF"
				strokeWidth="0"
				fontSize="90"
				fontFamily="Arial"
				textAnchor="middle"
				dominantBaseline="central"
			>
				{props.letter.toUpperCase()}
			</text>
		</svg>
	)
}

export default {
	type: "website_linkage",
	element: WebsiteLinkage as unknown as JSX.Element,
	metadata: {
		name: "Recent Sites",
		author: "aridevelopment.de",
		defaultComponent: false,
		removeableComponent: true,
		installableComponent: true
	},
	headerSettings: {
		name: "Recent Sites",
		type: "website_linkage",
		option: {
			type: "toggle",
			default: true
		}
	},
	contentSettings: [
		{
			name: "Amount of Sites",
			key: "limit",
			type: "number",
			options: {
				default: 8,
				min: 1,
				max: 100,
				step: 1,
			}
		}
	],
} as KnownComponent;
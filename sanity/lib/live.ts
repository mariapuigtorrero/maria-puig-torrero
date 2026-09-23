// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Lets sanityFetch() automatically resolve to draft content whenever
  // Next.js draft mode is enabled (see app/api/draft-mode/*), so an editor
  // can preview an unpublished project before publishing it.
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: false,
});

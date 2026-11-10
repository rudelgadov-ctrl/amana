# Architecture rules

- Public CMS images share one React Query collection, fetched at startup and filtered by location; persist only public active image metadata and revalidate on each load so repeat visits avoid the query waterfall without freezing CMS edits.
- Prewarm only the current public page's photos during the existing loading screen, prioritize its hero, and exclude videos; unrelated media must not compete with first-paint downloads.
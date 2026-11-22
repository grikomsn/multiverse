import { allSkills, type Resume } from "./resume"

/** ProfilePage and Person for /resume. The Person `@id` is shared with the rest of the site. */
export function resumeJsonLd(resume: Resume) {
  const { site, profile, experience, education, skills, updatedAt } = resume
  const personId = `${site.origin}/#person`
  const organization = (name: string, url?: string) => ({
    "@type": "Organization",
    name,
    ...(url ? { url } : {}),
  })
  const currentEmployers = [
    ...new Map(
      experience
        .filter((entry) => entry.current)
        .map((entry) => [entry.organization, organization(entry.organization, entry.url)]),
    ).values(),
  ]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${site.url}#profile-page`,
        url: site.url,
        name: `${profile.name} – Resume`,
        description: site.description,
        inLanguage: "en",
        ...(updatedAt ? { dateModified: updatedAt } : {}),
        mainEntity: { "@id": personId },
        isPartOf: { "@type": "WebSite", url: site.origin },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        givenName: profile.givenName,
        familyName: profile.familyName,
        ...(profile.headline ? { jobTitle: profile.headline } : {}),
        description: profile.summary,
        email: `mailto:${profile.email}`,
        url: site.origin,
        ...(profile.avatar ? { image: profile.avatar.url } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location.split(",")[0]?.trim(),
          ...(profile.countryCode ? { addressCountry: profile.countryCode } : {}),
        },
        ...(profile.country ? { nationality: { "@type": "Country", name: profile.country } } : {}),
        sameAs: profile.profiles.filter((url) => url !== profile.website),
        knowsAbout: allSkills(skills),
        knowsLanguage: profile.languages,
        worksFor: currentEmployers,
        alumniOf: education.map((entry) => ({
          "@type": "EducationalOrganization",
          name: entry.school,
          ...(entry.url ? { url: entry.url } : {}),
        })),
      },
    ],
  }
}

import { coverLetter } from "./documents/cover-letter"
import { edition, editionAsset } from "./documents/edition"
import { education } from "./documents/education"
import { experience } from "./documents/experience"
import { involvement } from "./documents/involvement"
import { organization } from "./documents/organization"
import { page } from "./documents/page"
import { portrait } from "./documents/portrait"
import { post } from "./documents/post"
import { project } from "./documents/project"
import { skillGroup } from "./documents/skill-group"
import { talk } from "./documents/talk"
import { figure } from "./objects/figure"
import { partialDate } from "./objects/partial-date"
import { codeBlock, embed, profileLinks, richText } from "./objects/rich-text"
import { socialLink } from "./objects/social-link"
import { profile } from "./singletons/profile"
import { site } from "./singletons/site"

export const schemaTypes = [
  // Singletons
  profile,
  site,
  // Writing
  post,
  page,
  // Career
  organization,
  experience,
  education,
  skillGroup,
  project,
  talk,
  involvement,
  coverLetter,
  // Media
  portrait,
  // Archive
  edition,
  // Objects
  partialDate,
  figure,
  socialLink,
  richText,
  codeBlock,
  embed,
  profileLinks,
  editionAsset,
]

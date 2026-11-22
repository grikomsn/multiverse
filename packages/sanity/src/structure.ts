import { ArchiveIcon } from "@sanity/icons/Archive"
import { BookIcon } from "@sanity/icons/Book"
import { CaseIcon } from "@sanity/icons/Case"
import { ComposeIcon } from "@sanity/icons/Compose"
import { DocumentIcon } from "@sanity/icons/Document"
import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { HeartIcon } from "@sanity/icons/Heart"
import { ImageIcon } from "@sanity/icons/Image"
import { MicrophoneIcon } from "@sanity/icons/Microphone"
import { ProjectsIcon } from "@sanity/icons/Projects"
import { TagIcon } from "@sanity/icons/Tag"
import { UsersIcon } from "@sanity/icons/Users"
import {
  orderableDocumentListDeskItem,
  type OrderableListConfig,
} from "@sanity/orderable-document-list"
import type { ComponentType } from "react"
import type { ListItem, ListItemBuilder, StructureResolver } from "sanity/structure"

type S = Parameters<StructureResolver>[0]
type Context = Parameters<StructureResolver>[1]

function orderable(S: S, context: Context, type: string, title: string, icon: ComponentType) {
  // The plugin's types lag behind the structure builder's; the runtime shape matches.
  return orderableDocumentListDeskItem({
    type,
    title,
    icon,
    S,
    context,
  } as unknown as OrderableListConfig) as unknown as ListItem
}

function plain(S: S, type: string, title: string, icon: ComponentType): ListItemBuilder {
  return S.documentTypeListItem(type).title(title).icon(icon).showCount()
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().singleton("profile"),
      S.listItem().singleton("site"),

      S.divider().title("Writing"),
      S.listItem()
        .title("Posts")
        .icon(DocumentTextIcon)
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      plain(S, "page", "Pages", DocumentIcon),

      S.divider().title("Career"),
      orderable(S, context, "experience", "Experience", CaseIcon),
      orderable(S, context, "project", "Projects", ProjectsIcon),
      S.listItem()
        .title("Talks")
        .icon(MicrophoneIcon)
        .schemaType("talk")
        .child(
          S.documentTypeList("talk")
            .title("Talks")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
      orderable(S, context, "involvement", "Involvement", HeartIcon),
      orderable(S, context, "education", "Education", BookIcon),
      orderable(S, context, "skillGroup", "Skills", TagIcon),
      plain(S, "organization", "Organizations", UsersIcon),
      plain(S, "coverLetter", "Cover letters", ComposeIcon),

      S.divider().title("Media"),
      orderable(S, context, "portrait", "Portraits", ImageIcon),

      S.divider().title("Archive"),
      S.listItem()
        .title("Editions")
        .icon(ArchiveIcon)
        .schemaType("edition")
        .child(
          S.documentTypeList("edition")
            .title("Editions")
            .defaultOrdering([{ field: "startDate", direction: "asc" }]),
        ),
    ])

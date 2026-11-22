import { ProjectsIcon } from "@sanity/icons/Projects"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineArrayMember, defineField, defineType } from "sanity"

import {
  highlightsField,
  onResumeField,
  orderField,
  organizationField,
  slugField,
  technologiesField,
} from "../shared/fields"

/** Things built or maintained. A role in a community is an `involvement`. */
export const project = defineType({
  name: "project",
  type: "document",
  icon: ProjectsIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
  ],
  orderings: [orderRankOrdering],
  fields: [
    orderField("project"),
    defineField({
      name: "name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("name"), group: "details" },
    defineField({
      name: "role",
      type: "string",
      group: "details",
      description: "e.g. “Author, maintainer”.",
    }),
    defineField({
      name: "kind",
      type: "string",
      group: "details",
      description: "Groups the Work page. Community roles are involvements, not projects.",
      options: {
        list: [
          { title: "Library or tool", value: "library" },
          { title: "Editor extension", value: "extension" },
          { title: "App", value: "app" },
          { title: "Built at work", value: "work" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    {
      ...organizationField({ description: "Company or community the project belongs to." }),
      group: "details",
    },
    defineField({
      name: "startDate",
      type: "partialDate",
      group: "details",
      description: "When it started. The status says whether it is still going.",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Maintained", value: "maintained" },
          { title: "Archived", value: "archived" },
          { title: "Discontinued", value: "discontinued" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "active",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "url", title: "URL", type: "url", group: "details" }),
    defineField({
      name: "repositories",
      type: "array",
      group: "details",
      description:
        "GitHub repositories as owner/name, the main one first. Its page is the source link; every repository adds its stars.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.regex(/^[\w.-]+\/[\w.-]+$/, { name: "owner/name" }),
        }),
      ],
      options: { layout: "tags" },
    }),
    { ...technologiesField, group: "details" },
    defineField({
      name: "packages",
      type: "array",
      group: "details",
      description: "Published packages. Downloads and installs are added up when the site builds.",
      of: [
        defineArrayMember({
          name: "package",
          type: "object",
          fields: [
            defineField({
              name: "registry",
              type: "string",
              options: {
                list: [
                  { title: "npm", value: "npm" },
                  { title: "VS Code Marketplace", value: "vscode" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "name",
              type: "string",
              description: "npm: the package name. VS Code: publisher.name.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "registry" } },
        }),
      ],
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "details",
      validation: (rule) => rule.required().max(320),
    }),
    { ...highlightsField, group: "details" },
    defineField({ name: "cover", type: "figure", group: "media" }),
    defineField({
      name: "icon",
      type: "image",
      group: "media",
      description:
        "The project's own mark, or the mark of what it is built for. Use a transparent ground where possible. Project cards on nibras.co draw its shape in dots.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),
    { ...onResumeField, group: "details" },
  ],
  preview: {
    select: { title: "name", role: "role", status: "status", media: "cover" },
    prepare: ({ title, role, status, media }) => ({
      title,
      subtitle: [status !== "active" ? status : null, role].filter(Boolean).join(" · "),
      media,
    }),
  },
})

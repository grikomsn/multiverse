import cns from '@sindresorhus/class-names'
import { NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import importIcon from '../lib/import-icon'
import contentful from '../services/contentful'

type AppearanceEntry = {
  title: string
  date: any
  description: string
  url: string
  tags: string[]
  icon: string
}

interface AppearancesProps extends React.ComponentProps<'div'> {
  appearanceEntries: AppearanceEntry[]
}

function Appearances({ appearanceEntries }: AppearancesProps) {
  return (
    <Main>
      <NextSeo title="Appearances" />
      <Content>
        <div className="text-center">
          <h1>Appearances and Talks</h1>
          <p>
            List of appearances from various events such as meetups and
            workshops.
          </p>
        </div>

        <br />

        {appearanceEntries.map(
          ({ title, date, description, url, tags, icon }) => {
            const Icon = importIcon(icon)
            const classNames = cns(
              'flex items-center',
              'mb-2 px-4 py-2',
              'no-underline rounded transition-all',
              'hover:bg-dodger-blue-500 hover:shadow-lg',
              'text-gray-100 hover:text-gray-100'
            )

            return (
              <A href={url} className={classNames} key={title}>
                <div className="pl-2 pr-6 w-18">
                  <Icon size={36} />
                </div>
                <div>
                  <h3 className="mt-2 mb-1">{title}</h3>
                  <p className="my-1">
                    {date} - {description}
                  </p>
                  <div className="flex flex-wrap my-2 text-gray-500 text-xs">
                    {tags.map(tag => (
                      <span
                        className="border border-gray-600 mb-1 mr-1 px-2 py-1 rounded"
                        key={tag}
                        children={tag}
                      />
                    ))}
                  </div>
                </div>
              </A>
            )
          }
        )}
      </Content>
    </Main>
  )
}

Appearances.getInitialProps = async (_ctx: NextPageContext) => {
  const entries = await contentful.getEntries({
    content_type: 'appearances',
    order: '-fields.date',
  })

  const appearanceEntries = entries.items.map(({ fields }: any) => ({
    ...fields,
    date: new Date(fields.date).toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }))

  return { appearanceEntries }
}

export default Appearances

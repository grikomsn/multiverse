import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import talks from '../data/talks'

function Appearances() {
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

        {talks.map(({ title, date, description, url, tags, Icon }) => (
          <A
            href={url}
            className="hover:bg-dodger-blue-500 flex items-center mb-2 no-underline px-4 py-2 rounded hover:shadow-lg transition-all"
            key={title}
          >
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
        ))}
      </Content>
    </Main>
  )
}

export default Appearances

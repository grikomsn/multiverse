import { NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import contentful from '../services/contentful'

type ContactGroupLinks = {
  title: string
  links: { description: string; link: string }[]
}

interface ContactProps extends React.ComponentProps<'div'> {
  linkEntries: ContactGroupLinks[]
}

function Contact({ linkEntries }: ContactProps) {
  return (
    <Main>
      <NextSeo title="Contact" />
      <Content>
        <h1>Contact Me</h1>
        <p>
          Get in touch via email at{' '}
          <a href="mailto:hello@griko.id">hello@griko.id</a> or at{' '}
          <a href="mailto:griko@pm.me">griko@pm.me</a> for sensitive matters.
          You can also contact or view my public accounts via these links below.
        </p>

        {linkEntries.map(({ title, links }) => (
          <React.Fragment key={title}>
            <h3>{title}</h3>
            <ul>
              {links.map(({ description, link }) => (
                <li key={description}>
                  <span className="font-semibold">{description}</span>
                  {' - '}
                  <A href={link}>{link}</A>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </Content>
    </Main>
  )
}

Contact.getInitialProps = async (_ctx: NextPageContext) => {
  const entries = await contentful.getEntries({
    content_type: 'contactGroupLinks',
    order: 'fields.title',
  })

  const linkEntries = entries.items.map(({ fields }: any) => ({
    title: fields.title,
    links: fields.links.map((l: string) => {
      const [description, link] = l.split(' ## ')
      return { description, link }
    }),
  }))

  return { linkEntries }
}

export default Contact

import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import contact from '../data/contact'

function Contact() {
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

        {contact.map(({ name, links }) => (
          <React.Fragment key={name}>
            <h3>{name}</h3>
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

export default Contact

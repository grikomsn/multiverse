const ExternalLink = ({ children, ...props }) => (
  <a rel="noopener noreferrer" target="_blank" {...props}>
    {children}
  </a>
)

export default ExternalLink

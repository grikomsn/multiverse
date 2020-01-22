import dynamic from 'next/dynamic'
import { IconType } from 'react-icons'

function importIcon(icon: string) {
  return dynamic(() =>
    import('react-icons/fi').then(fi => {
      if (icon in fi) {
        return fi[icon]
      }
      return fi.FiCircle
    })
  ) as IconType
}

export default importIcon

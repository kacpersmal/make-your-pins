import { Github, Linkedin, Youtube, Globe } from 'lucide-react'

interface SocialLinksType {
  github?: string
  linkedin?: string
  youtube?: string
  website?: string
}
export const SocialLinks = ({ links }: { links?: SocialLinksType }) => {
  if (!links || Object.keys(links).length === 0) return null

  return (
    <div className="flex items-center gap-2 ml-2">
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <Github size={16} />
          <span className="sr-only">GitHub</span>
        </a>
      )}

      {links.linkedin && (
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <Linkedin size={16} />
          <span className="sr-only">LinkedIn</span>
        </a>
      )}

      {links.youtube && (
        <a
          href={links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <Youtube size={16} />
          <span className="sr-only">YouTube</span>
        </a>
      )}

      {links.website && (
        <a
          href={links.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
        >
          <Globe size={16} />
          <span className="sr-only">Website</span>
        </a>
      )}
    </div>
  )
}

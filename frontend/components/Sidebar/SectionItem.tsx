interface SectionItemProps {
  title: string
}

export default function SectionItem({ title }: SectionItemProps) {
  return <li className="p-2">{title}</li>
}
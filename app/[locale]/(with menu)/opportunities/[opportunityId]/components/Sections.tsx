import Accordion from '@/components/Accordion'
import type {OpportunityType} from '@/utils/types'
import AccordionSection from './AccordionSection'
import {numberArray} from '@/utils/numberArray'

type Props = {
  sections: OpportunityType['sections']
}
const Sections = ({sections}: Props) => {
  if (!sections || !sections.length) return null

  return (
    <div className="flex flex-col gap-y-8">
      {sections
        .filter(section => !!section.heading)
        .map((section, i) => (
          <Accordion
            key={i}
            title={section.heading}
            subtitle={`(${numberArray(4)
              .map(i => section[`title${i}` as 'title1'])
              .filter(title => !!title)
              .join(', ')})`}
          >
            {numberArray(4).map(i => (
              <AccordionSection
                key={i}
                title={section[`title${i}` as 'title1']}
                text={section[`description${i}` as 'description1']}
              />
            ))}
          </Accordion>
        ))}
    </div>
  )
}

export default Sections

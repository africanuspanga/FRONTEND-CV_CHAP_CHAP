import type { LetterData } from '@/types/letter';

export function generateLetterBody(data: LetterData): string[] {
  const { sender, recipient, job, strengths } = data;
  const recipientName = recipient.name || 'Hiring Manager';
  const senderFirstName = sender.name.split(' ')[0] || 'the applicant';
  const companyName = job.company || recipient.company || 'your organization';
  const jobTitle = job.title || 'the open position';
  const remoteNote = job.isRemote ? ' (remote)' : '';

  const strengthsList = strengths.length > 0 ? strengths : ['dedication', 'professionalism', 'teamwork'];
  const strengthsText =
    strengthsList.length === 1
      ? strengthsList[0].toLowerCase()
      : strengthsList.length === 2
        ? `${strengthsList[0].toLowerCase()} and ${strengthsList[1].toLowerCase()}`
        : `${strengthsList.slice(0, -1).map(s => s.toLowerCase()).join(', ')}, and ${strengthsList[strengthsList.length - 1].toLowerCase()}`;

  const opening = `I am writing to express my strong interest in the ${jobTitle}${remoteNote} position at ${companyName}. Having researched your company and its values, I am confident that my background and skills make me an excellent fit for this role.`;

  const skillsParagraph = `Throughout my career, I have developed strong ${strengthsText} skills that have consistently enabled me to deliver results. These competencies, combined with my passion for excellence, have allowed me to make meaningful contributions in every role I have held.`;

  const companyParagraph = job.description
    ? `I am particularly drawn to ${companyName} because the role aligns closely with my experience. Based on the job description, I am confident I can contribute to your team's goals and help drive the company's continued success.`
    : `I am particularly drawn to ${companyName} and am excited about the opportunity to contribute to your team. I believe my skills and experience align well with your company's mission, and I am eager to bring my expertise to help drive continued success.`;

  const closing = `Thank you for considering my application. I would welcome the opportunity to discuss how my qualifications and experience can benefit ${companyName}. I look forward to hearing from you at your earliest convenience.`;

  return [opening, skillsParagraph, companyParagraph, closing];
}

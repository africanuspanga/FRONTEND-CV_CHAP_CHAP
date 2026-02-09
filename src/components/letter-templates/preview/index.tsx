import type { LetterData } from '@/types/letter';

interface LetterTemplatePreviewProps {
  templateId: string;
  data: LetterData;
}

export function LetterTemplatePreview({ templateId, data }: LetterTemplatePreviewProps) {
  switch (templateId) {
    case 'whitespace':
      return <WhitespaceTemplate data={data} />;
    case 'contempo':
      return <ContempoTemplate data={data} />;
    case 'managerial':
      return <ManagerialTemplate data={data} />;
    case 'refined':
      return <RefinedTemplate data={data} />;
    case 'pacific':
      return <PacificTemplate data={data} />;
    case 'professional':
    default:
      return <ProfessionalTemplate data={data} />;
  }
}

function formatDate(date: string) {
  return date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function SignatureBlock({ data }: { data: LetterData }) {
  if (data.signature.mode === 'draw' && data.signature.dataUrl) {
    return (
      <div className="mt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.signature.dataUrl} alt="Signature" className="h-14 object-contain" />
        <p className="mt-1">{data.sender.name}</p>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <p style={{ fontFamily: data.signature.fontFamily }} className="text-2xl">
        {data.sender.name}
      </p>
      <p className="mt-1">{data.sender.name}</p>
    </div>
  );
}

/* ─── Template 1: Professional ─── */
function ProfessionalTemplate({ data }: { data: LetterData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Dark top line */}
      <div className="h-2 bg-gray-900" />

      <div className="flex-1 px-16 py-10">
        {/* Centered name */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide uppercase">{data.sender.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {[data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}
          </p>
        </div>

        <div className="border-t border-gray-300 mb-8" />

        {/* Date */}
        <p className="text-sm text-gray-700 mb-6">{formatDate(data.date)}</p>

        {/* Recipient */}
        {(data.recipient.name || data.recipient.company) && (
          <div className="text-sm text-gray-700 mb-6">
            {data.recipient.name && <p>{data.recipient.name}</p>}
            {data.recipient.company && <p>{data.recipient.company}</p>}
            {data.recipient.city && <p>{data.recipient.city}</p>}
          </div>
        )}

        {/* Salutation */}
        <p className="text-sm text-gray-900 mb-4">
          Dear {data.recipient.name || 'Hiring Manager'},
        </p>

        {/* Body */}
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Closing */}
        <div className="text-sm text-gray-900 mt-6">
          <p>Sincerely,</p>
          <SignatureBlock data={data} />
        </div>
      </div>
    </div>
  );
}

/* ─── Template 2: Whitespace ─── */
function WhitespaceTemplate({ data }: { data: LetterData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white flex flex-col px-20 py-16" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Sender name top-left */}
      <h1 className="text-xl font-light text-gray-800 tracking-widest uppercase mb-2">{data.sender.name}</h1>
      <p className="text-xs text-gray-400 tracking-wider mb-12">
        {[data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join('  ·  ')}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-400 mb-10">{formatDate(data.date)}</p>

      {/* Recipient */}
      {(data.recipient.name || data.recipient.company) && (
        <div className="text-sm text-gray-600 mb-10 leading-relaxed">
          {data.recipient.name && <p>{data.recipient.name}</p>}
          {data.recipient.company && <p>{data.recipient.company}</p>}
          {data.recipient.city && <p>{data.recipient.city}</p>}
        </div>
      )}

      {/* Salutation */}
      <p className="text-sm text-gray-800 mb-6">
        Dear {data.recipient.name || 'Hiring Manager'},
      </p>

      {/* Body — generous spacing */}
      <div className="space-y-6 text-sm text-gray-600 leading-[1.9]">
        {data.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Closing */}
      <div className="text-sm text-gray-800 mt-10">
        <p>Sincerely,</p>
        <SignatureBlock data={data} />
      </div>
    </div>
  );
}

/* ─── Template 3: Contempo ─── */
function ContempoTemplate({ data }: { data: LetterData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white flex flex-col" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Teal accent bar + right-aligned name */}
      <div className="flex">
        <div className="w-2 bg-teal-500 min-h-[120px]" />
        <div className="flex-1 px-14 py-8 flex justify-end">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">{data.sender.name}</h1>
            <p className="text-xs text-gray-500 mt-1">{data.sender.email}</p>
            <p className="text-xs text-gray-500">{[data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-16 pb-12">
        {/* Date */}
        <p className="text-sm text-gray-600 mb-6">{formatDate(data.date)}</p>

        {/* Recipient */}
        {(data.recipient.name || data.recipient.company) && (
          <div className="text-sm text-gray-700 mb-6">
            {data.recipient.name && <p>{data.recipient.name}</p>}
            {data.recipient.company && <p>{data.recipient.company}</p>}
            {data.recipient.city && <p>{data.recipient.city}</p>}
          </div>
        )}

        <p className="text-sm text-gray-900 mb-4">
          Dear {data.recipient.name || 'Hiring Manager'},
        </p>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="text-sm text-gray-900 mt-6">
          <p>Sincerely,</p>
          <SignatureBlock data={data} />
        </div>
      </div>
    </div>
  );
}

/* ─── Template 4: Managerial ─── */
function ManagerialTemplate({ data }: { data: LetterData }) {
  const initials = data.sender.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-[794px] h-[1123px] bg-white flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Navy header block with initials */}
      <div className="bg-[#1e3a5f] text-white px-16 py-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{data.sender.name}</h1>
          <p className="text-sm text-white/70 mt-1">
            {[data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}
          </p>
        </div>
      </div>

      <div className="flex-1 px-16 py-10">
        <p className="text-sm text-gray-600 mb-6">{formatDate(data.date)}</p>

        {(data.recipient.name || data.recipient.company) && (
          <div className="text-sm text-gray-700 mb-6">
            {data.recipient.name && <p>{data.recipient.name}</p>}
            {data.recipient.company && <p>{data.recipient.company}</p>}
            {data.recipient.city && <p>{data.recipient.city}</p>}
          </div>
        )}

        <p className="text-sm text-gray-900 mb-4">
          Dear {data.recipient.name || 'Hiring Manager'},
        </p>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="text-sm text-gray-900 mt-6">
          <p>Sincerely,</p>
          <SignatureBlock data={data} />
        </div>
      </div>
    </div>
  );
}

/* ─── Template 5: Refined ─── */
function RefinedTemplate({ data }: { data: LetterData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white p-8" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Double line border */}
      <div className="border-2 border-gray-800 p-2 h-full">
        <div className="border border-gray-400 p-10 h-full flex flex-col">
          {/* Centered name */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wider">{data.sender.name}</h1>
            <p className="text-xs text-gray-500 mt-2 tracking-wide">
              {[data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}
            </p>
          </div>

          <div className="border-t border-gray-300 mb-6" />

          <p className="text-sm text-gray-600 mb-6">{formatDate(data.date)}</p>

          {(data.recipient.name || data.recipient.company) && (
            <div className="text-sm text-gray-700 mb-6">
              {data.recipient.name && <p>{data.recipient.name}</p>}
              {data.recipient.company && <p>{data.recipient.company}</p>}
              {data.recipient.city && <p>{data.recipient.city}</p>}
            </div>
          )}

          <p className="text-sm text-gray-900 mb-4">
            Dear {data.recipient.name || 'Hiring Manager'},
          </p>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed flex-1">
            {data.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="text-sm text-gray-900 mt-6">
            <p>Sincerely,</p>
            <SignatureBlock data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Template 6: Pacific ─── */
function PacificTemplate({ data }: { data: LetterData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white flex flex-col" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-16 py-10">
        <h1 className="text-3xl font-bold">{data.sender.name}</h1>
        <p className="text-sm text-white/80 mt-2">
          {[data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}
        </p>
      </div>

      <div className="flex-1 px-16 py-10">
        <p className="text-sm text-gray-600 mb-6">{formatDate(data.date)}</p>

        {(data.recipient.name || data.recipient.company) && (
          <div className="text-sm text-gray-700 mb-6">
            {data.recipient.name && <p>{data.recipient.name}</p>}
            {data.recipient.company && <p>{data.recipient.company}</p>}
            {data.recipient.city && <p>{data.recipient.city}</p>}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-900 mb-4">
          Dear {data.recipient.name || 'Hiring Manager'},
        </p>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="text-sm text-gray-900 mt-6">
          <p className="font-semibold">Sincerely,</p>
          <SignatureBlock data={data} />
        </div>
      </div>
    </div>
  );
}

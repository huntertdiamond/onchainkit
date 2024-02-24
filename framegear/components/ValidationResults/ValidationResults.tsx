import { frameResultsAtom } from '@/utils/store';
import { vNextSchema } from '@/utils/validation';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { type SchemaDescription } from 'yup';
import { ClipboardCopyIcon } from '@radix-ui/react-icons';

const REQUIRED_FIELD_NAMES = Object.entries(vNextSchema.describe().fields).reduce(
  (acc, [name, description]) =>
    (description as SchemaDescription).optional ? acc : [...acc, name],
  [] as string[],
);

export function ValidationResults() {
  const [results] = useAtom(frameResultsAtom);

  if (results.length === 0) {
    return <ValidationResultsPlaceholder />;
  }

  return <ValidationResultsContent />;
}

function ValidationResultsPlaceholder() {
  return (
    <div className="flex flex-col gap-4">
      <h2>Frame validations</h2>
      <div className="bg-content flex w-full flex-col gap-4 rounded-xl p-6">
        <p>No data yet.</p>
      </div>
    </div>
  );
}
enum FCFieldNames {
  FcFrame = 'fc:frame',
  FcFrameImage = 'fc:frame:image',
  OgImage = 'og:image',
  FcFramePostUrl = 'fc:frame:post_url',
  FcFrameButton1 = 'fc:frame:button:1',
  FcFrameButton2 = 'fc:frame:button:2',
  FcFrameButton3 = 'fc:frame:button:3',
  FcFrameButton4 = 'fc:frame:button:4',
  FcFrameInputText = 'fc:frame:input:text',
  FcFrameImageAspectRatio = 'fc:frame:image:aspect_ratio',
}

function ValidationResultsContent() {
  const [results] = useAtom(frameResultsAtom);
  const latestResult = results[results.length - 1];

  const sortedTags = useMemo(() => {
    const tagEntries = Object.entries(latestResult?.tags || {});
    const sortedEntries = tagEntries.sort((a, b) => {
      const orderA = Object.values(FCFieldNames).indexOf(a[0] as FCFieldNames);
      const orderB = Object.values(FCFieldNames).indexOf(b[0] as FCFieldNames);
      return orderA - orderB;
    });
    // get all of the fc:button[x]s  and place them in one row to preserve vertical space
    const buttonsRow = sortedEntries.filter(([key]) =>
      [
        FCFieldNames.FcFrameButton1,
        FCFieldNames.FcFrameButton2,
        FCFieldNames.FcFrameButton3,
        FCFieldNames.FcFrameButton4,
      ].includes(key as FCFieldNames),
    );
    //  Filter the input placeholder, the fc:frame value, and the aspect ratio for a row.
    const inputAndAspectRatioRow = sortedEntries.filter(([key]) =>
      [
        FCFieldNames.FcFrameInputText,
        FCFieldNames.FcFrame,
        FCFieldNames.FcFrameImageAspectRatio,
      ].includes(key as FCFieldNames),
    );
    //  get all of the other tags and place them in their own row.
    const otherRows = sortedEntries.filter(
      ([key]) =>
        !buttonsRow.concat(inputAndAspectRatioRow).some(([buttonKey]) => buttonKey === key),
    );

    return { buttonsRow, inputAndAspectRatioRow, otherRows };
  }, [latestResult]);

  return (
    <div className="max-w-1/2 flex flex-col gap-2">
      <span className="bg-content w-full rounded-[4px] p-2">
        <h2>
          Frame validations{' '}
          {!!latestResult && (
            <span className="">
              (<b>tl;dr:</b> {latestResult.isValid ? 'lgtm ✅' : 'borked ❌'})
            </span>
          )}
        </h2>
      </span>
      <div className="bg-content flex flex-col rounded-[8px] p-4">
        <div className="flex justify-between ">
          {sortedTags.buttonsRow.map(([key, value]) => (
            <ValidationEntry key={key} name={key} value={value} error={latestResult.errors[key]} />
          ))}
        </div>
        <hr className="my-4 opacity-30" />
        <div className="flex justify-between">
          {sortedTags.inputAndAspectRatioRow.map(([key, value]) => (
            <ValidationEntry key={key} name={key} value={value} error={latestResult.errors[key]} />
          ))}
        </div>
        {sortedTags.otherRows.map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <ValidationEntry name={key} value={value} error={latestResult.errors[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}
type ValidationEntryProps = { name: string; value?: string; error?: string };
function ValidationEntry({ name, value, error }: ValidationEntryProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div className="flex items-center gap-4">
        <span>{name}</span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={() => copyToClipboard(value)}
              className="rounded p-1 hover:bg-gray-500"
              title="Copy to clipboard"
            >
              <ClipboardCopyIcon className="h-4 w-4" />
            </button>
          )}
          <span className="text-xs">{error ? '🔴' : '🟢'}</span>
        </div>
      </div>
      <div className="break-all font-mono">{value || 'Not set'}</div>
      {!!error && <div className="font-mono italic">{error}</div>}
    </div>
  );
}

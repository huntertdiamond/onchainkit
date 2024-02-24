import { fetchFrame } from '@/utils/fetchFrame';
import { frameResultsAtom } from '@/utils/store';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

export function FrameInput() {
  const [url, setUrl] = useState('');
  const [_, setResults] = useAtom(frameResultsAtom);

  const getResults = useCallback(async () => {
    const result = await fetchFrame(url);
    setResults((prev) => [...prev, result]);
  }, [setResults, url]);

  return (
    <div className="flex  gap-2">
      <span className='flex border-pallette-line bg-input h-[40px] rounded-md border p-2 w-full'>
        <input
          className="bg-input w-full focus:outline-none focus:ring-0 w-full"
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          title='Enter your frame URL here to fetch'
        />
        <span title='Enter your frame URL here to fetch'>
      <InfoCircledIcon className='h-5 w-5'/>
        </span>
      </span>
      <button
        className="h-[40px] w-full self-end rounded-md bg-white text-black w-min px-2"
        type="button"
        onClick={getResults}
        disabled={url.length < 1}
      >
        Fetch
      </button>
      <hr className='opacity-60'/>
    </div>
  );
}

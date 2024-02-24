import { fetchFrame } from '@/utils/fetchFrame';
import { frameResultsAtom } from '@/utils/store';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

export function FrameInput() {
  // Initialize the URL state with the 'frameURL' query parameter if it exists
  const [url, setUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('frameURL') || '';
  });
  const [_, setResults] = useAtom(frameResultsAtom);

  const getResults = useCallback(async () => {
    const result = await fetchFrame(url);
    setResults((prev) => [...prev, result]);
  }, [setResults, url]);

  // Update the URL query parameter 'frameURL' to reflect the current frame URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    const params = new URLSearchParams(window.location.search);
    if (newUrl) {
      params.set('frameURL', newUrl);
    } else {
      params.delete('frameURL');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  return (
    <div className="flex  gap-2">
      <span className="border-pallette-line bg-input flex h-[40px] w-full rounded-md border p-2">
        <input
          className="bg-input w-full w-full focus:outline-none focus:ring-0"
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={handleUrlChange}
          title="Enter your frame URL here to fetch"
        />
        {!url && (
          <span title="Enter your frame URL here to fetch">
            <InfoCircledIcon className="h-5 w-5" />
          </span>
        )}
      </span>
      <button
        className="h-[40px] w-full w-min self-end rounded-md bg-white px-2 text-black"
        type="button"
        onClick={getResults}
        disabled={url.length < 1}
      >
        Fetch
      </button>
      <hr className="opacity-60" />
    </div>
  );
}

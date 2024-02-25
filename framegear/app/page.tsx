'use client';
import { Header } from '@/components/Header';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { ValidationResults } from '@/components/ValidationResults';

export default function Home() {
  return (
    <div className="max-w-layout-max mx-auto flex flex-col gap-8 pb-16">
      <Header />
      <div className="mx-auto flex w-full gap-8">
        <div className="flex w-1/3 flex-col gap-4">
          <FrameInput />
          <Frame />
        </div>
        <ValidationResults />
      </div>
    </div>
  );
}

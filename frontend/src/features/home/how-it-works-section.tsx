import { NotebookPen, Rocket, Save, Send } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="flex flex-col gap-10 max-w-[1460px] w-full mx-auto my-0 px-2.5">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">How It Works?</h2>
        <p className="text-slate-500">
          A distraction-free workflow designed for writers and readers.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
        {/* cards here */}
        <div className="md:col-span-2 md:row-span-1 rounded-xl border bg-slate-200 p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Write in Markdown</h3>
          <p className="text-slate-600 max-w-md">
            Focus on writing with a clean Markdown editor, live preview, and
            powerful keyboard shortcuts.
          </p>
          <NotebookPen />
        </div>
        <div className="md:col-span-1 rounded-xl border bg-slate-300 p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Save & refine</h3>
          <p className="text-slate-600">
            Autosave and drafts let you improve your content at your own pace.
          </p>
          <Save />
        </div>
        <div className="md:col-span-1 rounded-xl border bg-slate-300 p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Publish</h3>
          <p className="text-slate-600">
            Publish instantly and make your post discoverable for others.
          </p>
          <Rocket />
        </div>
        <div className="md:col-span-2 rounded-xl border bg-slate-200 p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Engage with community</h3>
          <p className="text-slate-600 max-w-md">
            Get feedback through likes and comments, join discussions, and
            discover new authors.
          </p>
          <Send />
        </div>
      </div>
    </section>
  );
};

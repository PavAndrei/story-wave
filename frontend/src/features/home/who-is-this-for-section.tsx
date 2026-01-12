export const WhoIsThisForSection = () => {
  return (
    <section className="max-w-[1460px] w-full mx-auto my-0 px-2.5">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold capitalize">Who is this for?</h2>
        <p className="text-slate-500">
          Designed for people who love writing — and those who love reading
          thoughtful content.
        </p>
      </div>
      <div className="flex flex-col gap-5 pt-10">
        <div className="flex justify-between items-center gap-10">
          <div className="w-1/2 bg-slate-200 h-[380px] rounded-md">
            <img
              src="./writer.png"
              alt=""
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col gap-3 w-1/2">
            <h3 className="text-xl font-semibold">For Authors</h3>
            <h4 className="font-medium text-lg">
              Built for writers who care about content, not distractions
            </h4>
            <p>
              This platform is designed for authors who value a clean writing
              experience and full control over their content. Write in Markdown,
              iterate freely, and publish when you’re ready — without fighting
              the editor or the interface.
            </p>
            <ul>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">Focus on writing</h5>
                <p>
                  Markdown-first workflow with live preview, drafts, and
                  autosave.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">Iterate and improve freely</h5>
                <div>
                  Edit published posts, manage drafts, and refine your ideas
                  over time.
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">Engage with real readers</h5>
                <div>
                  Get feedback through likes, comments, and discussions — not
                  vanity metrics.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center gap-10">
          <div className="w-1/2 flex flex-col gap-3">
            <h3 className="text-xl font-semibold">For Readers</h3>
            <h4 className="text-lg font-medium">
              Made for readers who enjoy discovering quality content
            </h4>
            <p>
              Discover posts written by independent authors, follow discussions,
              and explore content without noise or algorithmic pressure. Read,
              react, and connect with writers you enjoy.
            </p>
            <ul>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">Discover new authors</h5>
                <p>
                  Explore trending posts, popular writers, and recently
                  published content.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">
                  Engage in meaningful discussions
                </h5>
                <div>
                  Comment, reply, and interact with posts in a focused, readable
                  format.
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <h5 className="font-medium">Keep track of what matters</h5>
                <div>
                  Save posts to favorites and follow authors you care about.
                </div>
              </li>
            </ul>
          </div>
          <div className="w-1/2 bg-slate-200 h-[380px] rounded-md">
            <img
              src="./reader.png"
              alt=""
              className="rounded-md object-cover h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

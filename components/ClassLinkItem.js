function ClassLinkItem() {
  return (
    <li className="">
      <details
        className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg w-full hover:cursor-pointer"
        open
      >
        <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
          6th lesson Strings topic
        </summary>
        <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/x7Krla_UxRg"
          ></iframe>
          <div className="flex items-center space-x-5">
            <p>
              <span className="text-sm text-slate-600">By</span> Ramana Babu
            </p>
            <p>
              Uploaded on:{" "}
              <span className="text-sm text-slate-600">16th nov</span>
            </p>
          </div>
        </div>
      </details>
    </li>
  );
}

export default ClassLinkItem;

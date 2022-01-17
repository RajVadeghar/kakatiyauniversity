function AssignmentItem() {
  return (
    <li className="">
      <details
        className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg w-full hover:cursor-pointer"
        open
      >
        <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
          Assignment Title
        </summary>
        <div className="flex items-start justify-between gap-x-4 mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <div className="flex-1">
            <p className="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse at magna ut lectus suscipit viverra. Suspendisse nec
              enim eget justo vulputate consequat. Aenean semper, ligula
              condimentum dignissim varius, ipsum tellus aliquet augue, id
              mollis lectus ex quis est. Sed luctus efficitur est, non aliquet
              sapien viverra a. Maecenas eu suscipit eros, non placerat mi. Orci
              varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Nam pharetra facilisis ante quis aliquet.
              Vestibulum id nisl turpis. Sed laoreet sapien sit amet luctus
              egestas. Etiam egestas at turpis a porta. Ut gravida vel enim sit
              amet interdum. In velit metus, ultrices vitae lectus sed,
              vulputate aliquam felis. Phasellus eget ipsum congue mi pretium
              vestibulum tempor at tortor. Fusce mattis, lectus vitae auctor
              mattis, sapien odio sollicitudin libero, a maximus urna erat id
              sem. Vivamus a euismod nibh. Suspendisse ultrices mi ut gravida
              auctor.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end space-y-2 text-slate-600 text-xs">
            <p>
              Uploaded at: <span className="text-slate-800">16th nov</span>
            </p>
            <p>
              By<span className="text-slate-800"> Ramana Babu</span>
            </p>
          </div>
        </div>
      </details>
    </li>
  );
}

export default AssignmentItem;

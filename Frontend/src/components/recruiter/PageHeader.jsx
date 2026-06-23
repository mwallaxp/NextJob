const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

export default PageHeader;

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="p-8 text-center">
    {Icon && <Icon className="mx-auto h-8 w-8 text-zinc-300" />}
    <p className="mt-3 font-semibold text-zinc-950">{title}</p>
    {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;

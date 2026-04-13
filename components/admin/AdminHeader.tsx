"use client";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({
  title,
  description,
  action,
}: AdminHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-text-main">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

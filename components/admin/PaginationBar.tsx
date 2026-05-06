import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
}

export default function PaginationBar({ page, total, pageSize, basePath }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-xs text-text-secondary">
        Showing <span className="font-semibold text-text-main">{from}–{to}</span> of{" "}
        <span className="font-semibold text-text-main">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={`${basePath}?page=${page - 1}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            <ChevronLeft size={15} /> Previous 10
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-200 px-3 py-1.5 rounded-xl cursor-not-allowed">
            <ChevronLeft size={15} /> Previous 10
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={`${basePath}?page=${page + 1}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            Next 10 <ChevronRight size={15} />
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-200 px-3 py-1.5 rounded-xl cursor-not-allowed">
            Next 10 <ChevronRight size={15} />
          </span>
        )}
      </div>
    </div>
  );
}

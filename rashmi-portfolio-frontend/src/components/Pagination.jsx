export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 glass rounded-lg text-sm disabled:opacity-30 hover:border-accent-primary/40 transition-all"
      >
        ← Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
            page === currentPage
              ? 'bg-accent-primary/20 border border-accent-primary/50 text-accent-primary'
              : 'glass hover:border-accent-primary/30'
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 glass rounded-lg text-sm disabled:opacity-30 hover:border-accent-primary/40 transition-all"
      >
        Next →
      </button>
    </div>
  );
}

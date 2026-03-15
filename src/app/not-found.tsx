import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-display min-h-[60vh] text-4xl font-bold text-brand-600 mb-4">404 - Page Not Found</h2>
      <p className="text-ink/70 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn btn-primary"
      >
        Return Home
      </Link>
    </div>
  );
}

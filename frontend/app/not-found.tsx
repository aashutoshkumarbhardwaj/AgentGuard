import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-extrabold font-mono text-primary">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground">The requested page does not exist or has been moved.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

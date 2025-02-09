import Map from '@/components/Map';
import { api } from '@/lib/api-client';

// Make this page dynamic to avoid static build errors
export const dynamic = 'force-dynamic';

export default async function Home() {
  const health = await api.health();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Satellite Imagery Analysis Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze Earth&apos;s features using AI-powered satellite imagery
          </p>
          <p className="text-sm text-gray-500">API Status: {health.status}</p>
        </div>

        {/* Map Section */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Satellite View
          </h2>
          <Map />
        </section>
      </div>
    </main>
  );
}

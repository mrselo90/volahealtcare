import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/services/ServiceForm';

async function getService(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      translations: true,
      images: true,
      faqs: {
        include: {
          translations: true,
        },
      },
      beforeAfterImages: true,
    },
  });

  if (!service) {
    notFound();
  }

  return service;
}

export default async function ServiceEditPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = params.slug === 'new' ? null : await getService(params.slug) as Awaited<ReturnType<typeof getService>>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {service ? 'Edit Service' : 'New Service'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {service
            ? 'Edit service details, translations, and media'
            : 'Create a new medical service'}
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ServiceForm service={service} />
        </div>
      </div>
    </div>
  );
} 
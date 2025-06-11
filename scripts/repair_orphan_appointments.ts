import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find a valid service to assign
  const validService = await prisma.service.findFirst({});
  if (!validService) {
    console.error('No valid service found. Please create a service first.');
    process.exit(1);
  }

  // Find all orphaned appointments (serviceId does not match any service)
  const validServiceIds = (await prisma.service.findMany({ select: { id: true } })).map(s => s.id);
  const orphanedAppointments = await prisma.appointment.findMany({
    where: {
      NOT: {
        serviceId: { in: validServiceIds }
      }
    }
  });

  if (orphanedAppointments.length === 0) {
    console.log('No orphaned appointments found.');
    return;
  }

  // Update all orphaned appointments to use the valid service
  for (const appointment of orphanedAppointments) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { serviceId: validService.id },
    });
    console.log(`Updated appointment ${appointment.id} to serviceId ${validService.id}`);
  }

  console.log(`Repaired ${orphanedAppointments.length} orphaned appointments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
